# PHM AI Service

This directory strictly contains the **Python AWS Lambda** functions for the Bedrock RAG pipeline and PDF ingestion.

## Responsibilities
- **Ingestion:** Processing PHM knowledge-base PDFs and generating embeddings via Bedrock Titan.
- **RAG:** Orchestrating the retrieval-augmented generation flow using Bedrock Claude Haiku.
- **Vector Search:** Interacting with the `pgvector` extension in RDS.
- Deployment via AWS SAM (Serverless Application Model).
