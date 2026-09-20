import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Non-Disclosure Agreement",
  description:
    "Non-Disclosure Agreement for members of the AWS Student Builder Group at Lovely Professional University.",
};

const NDA_VERSION = "1.0";
const NDA_CREATED_AT = "21 September 2026";

export default function NDAPage() {
  return (
    <div className="min-h-screen bg-white text-[#111111]">
      <div className="mx-auto max-w-4xl px-6 py-12 sm:px-8 lg:px-10">
        {/* Header */}
        <header className="border-b border-[#e5e5e5] pb-8">
          <Link
            href="/dashboard"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#666666] transition-colors hover:text-[#111111]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>

          <div className="flex items-start justify-between gap-8">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#777777]">
                AWS Student Builder Group · Lovely Professional University
              </p>

              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Non-Disclosure Agreement
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#666666]">
                This Non-Disclosure Agreement governs the handling and
                protection of confidential and proprietary information
                disclosed to or accessed by a member in connection with their
                participation in the AWS Student Builder Group.
              </p>
            </div>

            <div className="hidden shrink-0 sm:block">
              <div className="flex h-12 w-12 items-center justify-center border border-[#e5e5e5] bg-[#fafafa]">
                <ShieldCheck className="h-6 w-6 text-[#111111]" />
              </div>
            </div>
          </div>

          {/* Document metadata */}
          <div className="mt-8 grid grid-cols-1 border border-[#e5e5e5] sm:grid-cols-3">
            <div className="border-b border-[#e5e5e5] px-5 py-4 sm:border-b-0 sm:border-r">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#888888]">
                Document
              </p>
              <p className="mt-1 text-sm font-medium">AWS LPU · NDA</p>
            </div>

            <div className="border-b border-[#e5e5e5] px-5 py-4 sm:border-b-0 sm:border-r">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#888888]">
                Version
              </p>
              <p className="mt-1 text-sm font-medium">{NDA_VERSION}</p>
            </div>

            <div className="px-5 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#888888]">
                Created At
              </p>
              <p className="mt-1 text-sm font-medium">{NDA_CREATED_AT}</p>
            </div>
          </div>
        </header>

        {/* Agreement */}
        <main className="py-10">
          <div className="space-y-10 text-sm leading-7 text-[#333333]">
            <section>
              <h2 className="text-lg font-semibold text-[#111111]">
                1. Parties
              </h2>

              <p className="mt-3">
                This Non-Disclosure Agreement (“Agreement”) is entered into
                between the <strong>AWS Student Builder Group at Lovely
                Professional University</strong> (“Organization”) and the
                individual member accepting this Agreement (“Member”).
              </p>

              <p className="mt-3">
                The Organization and the Member are collectively referred to
                as the “Parties” and individually as a “Party”.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#111111]">
                2. Purpose
              </h2>

              <p className="mt-3">
                The purpose of this Agreement is to protect confidential,
                proprietary, technical, operational, organizational, and other
                non-public information that the Member may receive, access,
                observe, create, or otherwise become aware of through their
                participation in the Organization, its projects, events,
                activities, internal systems, or related initiatives.
              </p>

              <p className="mt-3">
                The Member acknowledges that unauthorized disclosure or misuse
                of such information may cause harm to the Organization, its
                members, partners, participants, collaborators, or other
                persons whose information is handled by the Organization.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#111111]">
                3. Definition of Confidential Information
              </h2>

              <p className="mt-3">
                “Confidential Information” means any information that is not
                generally available to the public and that is disclosed to,
                accessed by, or otherwise made available to the Member in
                connection with the Organization.
              </p>

              <p className="mt-3">
                Confidential Information may include, without limitation:
              </p>

              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>
                  Internal project plans, roadmaps, strategies, proposals, and
                  operational information.
                </li>
                <li>
                  Source code, software, technical designs, system
                  architecture, documentation, databases, and internal tools.
                </li>
                <li>
                  Credentials, passwords, API keys, access tokens,
                  authentication information, and security-related information.
                </li>
                <li>
                  Unpublished event plans, recruitment information, internal
                  processes, communications, and organizational discussions.
                </li>
                <li>
                  Personal or non-public information relating to members,
                  applicants, participants, volunteers, speakers, partners, or
                  other individuals.
                </li>
                <li>
                  Information expressly identified as confidential or which a
                  reasonable person would understand to be confidential given
                  its nature and the circumstances of disclosure.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#111111]">
                4. Obligations of the Member
              </h2>

              <p className="mt-3">
                The Member agrees to use Confidential Information solely for
                legitimate purposes connected with their authorized
                participation in the Organization.
              </p>

              <p className="mt-3">The Member shall:</p>

              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>
                  Keep Confidential Information strictly confidential.
                </li>
                <li>
                  Exercise reasonable care to prevent unauthorized access,
                  disclosure, copying, modification, loss, or misuse.
                </li>
                <li>
                  Access and use Confidential Information only to the extent
                  reasonably necessary for authorized activities.
                </li>
                <li>
                  Not disclose Confidential Information to any unauthorized
                  person or third party without prior authorization.
                </li>
                <li>
                  Not reproduce, publish, distribute, sell, transfer, or
                  otherwise exploit Confidential Information for unauthorized
                  purposes.
                </li>
                <li>
                  Not use Confidential Information for personal, commercial, or
                  competitive purposes without written authorization.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#111111]">
                5. Information Security
              </h2>

              <p className="mt-3">
                The Member shall take reasonable technical and organizational
                measures to protect Confidential Information in their
                possession or control.
              </p>

              <p className="mt-3">
                Without limitation, the Member shall not intentionally expose
                confidential credentials, source code, private documents,
                internal communications, or other Confidential Information
                through public repositories, public messaging channels, social
                media, screenshots, file-sharing services, or other publicly
                accessible platforms.
              </p>

              <p className="mt-3">
                The Member shall promptly notify the Organization if they
                become aware of any unauthorized access, disclosure, loss, or
                compromise of Confidential Information.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#111111]">
                6. Exclusions
              </h2>

              <p className="mt-3">
                Confidential Information does not include information that the
                Member can demonstrate:
              </p>

              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>
                  Is or becomes publicly available through no breach of this
                  Agreement.
                </li>
                <li>
                  Was lawfully known to the Member before disclosure by the
                  Organization and was not subject to a confidentiality
                  obligation.
                </li>
                <li>
                  Was independently developed by the Member without use of or
                  reference to the Confidential Information.
                </li>
                <li>
                  Was lawfully obtained from a third party who was not under an
                  obligation to maintain its confidentiality.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#111111]">
                7. Legally Required Disclosure
              </h2>

              <p className="mt-3">
                If the Member is required by applicable law, regulation, court
                order, or governmental authority to disclose Confidential
                Information, the Member may disclose only the portion legally
                required to be disclosed.
              </p>

              <p className="mt-3">
                Where legally permitted, the Member shall provide the
                Organization with reasonable prior notice of such required
                disclosure and cooperate, where appropriate, with reasonable
                efforts to protect the confidential nature of the information.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#111111]">
                8. Return and Deletion of Information
              </h2>

              <p className="mt-3">
                Upon request by the Organization or upon the conclusion of the
                Member’s authorized participation, the Member shall, subject to
                applicable law and legitimate technical or archival
                requirements, return, delete, or securely dispose of
                Confidential Information in their possession or control.
              </p>

              <p className="mt-3">
                This obligation applies to Confidential Information stored on
                personal devices, cloud storage, repositories, communication
                platforms, or other systems controlled by the Member.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#111111]">
                9. No Transfer of Rights
              </h2>

              <p className="mt-3">
                Nothing in this Agreement grants the Member any ownership
                interest, intellectual property right, license, or other right
                in or to the Organization’s Confidential Information except
                the limited right to use such information for authorized
                purposes.
              </p>

              <p className="mt-3">
                All intellectual property and proprietary rights remain with
                their respective owners unless expressly agreed otherwise in
                writing.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#111111]">
                10. Personal and Third-Party Information
              </h2>

              <p className="mt-3">
                Where the Member receives or accesses personal information or
                confidential information belonging to participants, applicants,
                members, partners, speakers, or other third parties, the Member
                shall handle such information only for authorized purposes and
                shall not disclose or misuse such information.
              </p>

              <p className="mt-3">
                The Member shall comply with applicable policies and
                instructions relating to the handling and protection of such
                information.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#111111]">
                11. Term and Survival
              </h2>

              <p className="mt-3">
                This Agreement becomes effective when accepted by the Member
                and remains effective throughout the Member’s participation in
                the Organization.
              </p>

              <p className="mt-3">
                The Member’s confidentiality obligations shall continue after
                the end of their participation for so long as the relevant
                information remains confidential and is not otherwise excluded
                under Section 6 of this Agreement, subject to applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#111111]">
                12. Breach
              </h2>

              <p className="mt-3">
                Any unauthorized use or disclosure of Confidential Information
                may constitute a breach of this Agreement.
              </p>

              <p className="mt-3">
                In the event of a breach, the Organization may take appropriate
                action in accordance with its applicable policies, participation
                terms, and applicable law. Such action may include suspension or
                termination of access to Organization systems, projects,
                resources, or activities.
              </p>

              <p className="mt-3">
                Nothing in this Agreement limits any rights or remedies that may
                otherwise be available under applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#111111]">
                13. No Waiver
              </h2>

              <p className="mt-3">
                A failure or delay by either Party to exercise any right or
                remedy under this Agreement shall not constitute a waiver of
                that right or remedy.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#111111]">
                14. Amendments
              </h2>

              <p className="mt-3">
                Any material amendment to this Agreement shall be communicated
                to the Member. Where acceptance is required for continued
                participation or access to relevant activities, the Member may
                be required to acknowledge the updated version.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#111111]">
                15. Governing Law and Jurisdiction
              </h2>

              <p className="mt-3">
                This Agreement shall be governed by and interpreted in
                accordance with the laws applicable in India.
              </p>

              <p className="mt-3">
                Subject to applicable law, disputes arising from or relating to
                this Agreement shall be subject to the jurisdiction of the
                competent courts having jurisdiction over the relevant parties
                and subject matter.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#111111]">
                16. Entire Agreement
              </h2>

              <p className="mt-3">
                This Agreement constitutes the understanding between the
                Parties concerning the confidentiality obligations described
                herein and supersedes prior discussions concerning the same
                subject matter to the extent permitted by applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#111111]">
                17. Acknowledgement and Acceptance
              </h2>

              <p className="mt-3">
                By accepting this Agreement, the Member confirms that they have
                been provided a reasonable opportunity to read and understand
                its terms and agree to comply with the confidentiality
                obligations contained herein.
              </p>

              <p className="mt-3">
                The Member understands that acceptance of the relevant offer or
                participation agreement may require simultaneous acceptance of
                this Non-Disclosure Agreement, and that such acceptance may be
                recorded electronically together with the applicable Agreement
                version and acceptance timestamp.
              </p>
            </section>

            {/* Acceptance notice */}
            <section className="border border-[#d9d9d9] bg-[#fafafa] p-6">
              <div className="flex gap-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#111111]" />

                <div>
                  <h2 className="text-sm font-semibold text-[#111111]">
                    Agreement Version
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#555555]">
                    This page represents NDA Version {NDA_VERSION}, created on{" "}
                    <strong>{NDA_CREATED_AT}</strong>. The version presented
                    during the offer acceptance process is the version to which
                    the Member’s acceptance applies.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#e5e5e5] pt-8">
          <div className="flex flex-col gap-4 text-xs text-[#888888] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-[#666666]">
                AWS Student Builder Group
              </p>
              <p className="mt-1">Lovely Professional University</p>
            </div>

            <div className="sm:text-right">
              <p>NDA Version {NDA_VERSION}</p>
              <p className="mt-1">Created {NDA_CREATED_AT}</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
