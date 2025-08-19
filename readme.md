# Uprez SME

## Overview

Uprez SME is a cutting-edge SaaS platform designed to revolutionize the process of preparing Small and Medium Enterprises (SMEs) in India for their Initial Public Offering (IPO) on platforms like BSE SME and NSE Emerge. It serves as a comprehensive solution for eligibility assessment, compliance management, document handling, and DRHP (Draft Red Herring Prospectus) preparation.

The platform aims to reduce the complexity, time, and cost associated with SME IPOs, while simultaneously addressing the knowledge gap that often exists for SMEs and even some intermediaries in navigating stringent regulatory requirements.

## Key Features (Initial Scope)

- **Eligibility Assessment:** Quick determination of SME IPO or Mainboard IPO eligibility.
- **Guided Compliance Workflow:** Step-by-step guidance through regulatory requirements (SEBI, Companies Act, Stock Exchanges, Accounting, Tax).
- **Automated Document Analysis:** Advanced AI/ML-driven parsing and extraction from unstructured documents (PDFs of financials, legal documents).
- **Compliance Gap Analysis:** Automated checks against regulatory rules, highlighting non-compliance and providing actionable recommendations.
- **Iterative "Generations":** Support for multiple cycles of compliance checks and remediation, allowing users to refine their submissions.
- **Centralized Document Management:** Secure storage and versioning of all IPO-related documents.
- **Collaboration:** Facilitates seamless collaboration between SMEs, Merchant Bankers, Company Secretaries, and Auditors.

## Technology Stack

- **Frontend:** Next.js, React, Redux Toolkit, Shadcn UI, Tailwind CSS
- **Frontend Data Persistence:** Neon Postgres (via Prisma ORM), UploadThing (for file storage)
- **Authentication:** Clerk
- **Backend (Processing Engine):** Python, FastAPI
- **Backend Data Persistence:** Neon Postgres (via Prisma ORM), S3 Compatible Object Storage (for engine's document access)
- **AI/ML:** LlamaIndex, Langchain (for RAG setup), Pinecone (Vector DB), Gemini & OpenAI (LLMs for embeddings and RAG)

## Getting Started

_(Placeholder for actual setup instructions - e.g., cloning repo, installing dependencies, running dev servers)_

This README provides a high-level overview.
http://34.87.213.149
Update : 5th Aug - 9 PM
