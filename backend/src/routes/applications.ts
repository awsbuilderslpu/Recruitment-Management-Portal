import { Router, Request, Response } from 'express';
import {
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  getNotesForApplication,
  addNote
} from '../services/googleSheets';

const router = Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const search = (req.query.search as string)?.toLowerCase() || '';
    const status = (req.query.status as string) || '';
    const sort = (req.query.sort as string) || 'timestamp_desc';

    let applications = await getAllApplications();

    if (search) {
      applications = applications.filter(app => 
        app.fullName.toLowerCase().includes(search) || 
        app.registrationNumber.toLowerCase().includes(search) ||
        app.universityEmail.toLowerCase().includes(search)
      );
    }
    if (status) {
      applications = applications.filter(app => app.status === status);
    }

    if (sort === 'timestamp_desc') {
      applications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } else if (sort === 'timestamp_asc') {
      applications.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }

    res.json({ success: true, data: applications });
  } catch (error) {
    console.error('[GET /applications] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch applications',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const application = await getApplicationById(id);

    if (!application) {
      res.status(404).json({ success: false, error: 'Application not found' });
      return;
    }

    res.json({ success: true, data: application });
  } catch (error) {
    console.error('[GET /applications/:id] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch application',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

const VALID_STATUSES = ['Pending', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'];

router.patch('/:id/status', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    if (!status || !VALID_STATUSES.includes(status)) {
      res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`
      });
      return;
    }

    const application = await getApplicationById(id);
    if (!application) {
      res.status(404).json({ success: false, error: 'Application not found' });
      return;
    }

    await updateApplicationStatus(application.rowIndex, status);

    res.json({
      success: true,
      message: `Status updated to "${status}"`,
      applicationId: id,
      newStatus: status,
    });
  } catch (error) {
    console.error('[PATCH /applications/:id/status] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update status',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.get('/:id/notes', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const application = await getApplicationById(id);
    if (!application) {
      res.status(404).json({ success: false, error: 'Application not found' });
      return;
    }

    const notes = await getNotesForApplication(id);

    res.json({
      success: true,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    console.error('[GET /applications/:id/notes] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notes',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.post('/:id/notes', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { author, note } = req.body;

    if (!note || typeof note !== 'string' || note.trim().length === 0) {
      res.status(400).json({ success: false, error: 'Note text is required' });
      return;
    }
    if (!author || typeof author !== 'string' || author.trim().length === 0) {
      res.status(400).json({ success: false, error: 'Author is required' });
      return;
    }

    const application = await getApplicationById(id);
    if (!application) {
      res.status(404).json({ success: false, error: 'Application not found' });
      return;
    }

    const created = await addNote(id, author.trim(), note.trim());

    res.status(201).json({ success: true, message: 'Note added', data: created });
  } catch (error) {
    console.error('[POST /applications/:id/notes] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add note',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
