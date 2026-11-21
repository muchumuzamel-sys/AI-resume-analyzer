import io
import os
from pypdf import PdfReader
import docx

class ResumeParseException(Exception):
    pass

class ResumeParser:
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

    @classmethod
    def validate_file(cls, uploaded_file):
        # FR-8: File size check
        if uploaded_file.size > cls.MAX_FILE_SIZE:
            raise ResumeParseException("File size exceeds 5MB limit. Please upload a smaller file.")

        filename = uploaded_file.name.lower()
        content_type = getattr(uploaded_file, 'content_type', '')

        valid_extensions = ('.pdf', '.docx', '.doc')
        if not filename.endswith(valid_extensions):
            raise ResumeParseException("Invalid file format. Only PDF and DOCX files are supported.")

        # Check magic bytes for PDF/DOCX (FR-9 content validation)
        uploaded_file.seek(0)
        header = uploaded_file.read(8)
        uploaded_file.seek(0)

        # PDF magic bytes: %PDF-
        is_pdf = header.startswith(b'%PDF-')
        # DOCX is a zip file: PK\x03\x04
        is_zip = header.startswith(b'PK\x03\x04')

        if not (is_pdf or is_zip or filename.endswith('.doc')):
            raise ResumeParseException("Uploaded file content does not match a valid PDF or DOCX format.")

    @classmethod
    def extract_text(cls, file_obj, filename):
        cls.validate_file(file_obj)
        name_lower = filename.lower()
        file_obj.seek(0)

        if name_lower.endswith('.pdf'):
            return cls._extract_from_pdf(file_obj)
        elif name_lower.endswith('.docx'):
            return cls._extract_from_docx(file_obj)
        else:
            # Fallback attempt
            try:
                return cls._extract_from_pdf(file_obj)
            except Exception:
                file_obj.seek(0)
                return cls._extract_from_docx(file_obj)

    @classmethod
    def _extract_from_pdf(cls, file_obj):
        try:
            reader = PdfReader(file_obj)
            pages_text = []
            page_count = len(reader.pages)
            
            for i, page in enumerate(reader.pages):
                text = page.extract_text() or ""
                pages_text.append(text)

            full_text = "\n\n".join(pages_text).strip()
            if not full_text or len(full_text) < 30:
                raise ResumeParseException(
                    "Could not extract readable text from this PDF. It may be a scanned image. Please provide a text-selectable PDF or DOCX."
                )

            return {
                "text": full_text,
                "page_count": page_count,
                "format": "pdf"
            }
        except Exception as e:
            if isinstance(e, ResumeParseException):
                raise e
            raise ResumeParseException(f"Error parsing PDF file: {str(e)}")

    @classmethod
    def _extract_from_docx(cls, file_obj):
        try:
            doc = docx.Document(file_obj)
            paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
            
            # Also extract text from tables
            for table in doc.tables:
                for row in table.rows:
                    row_text = " | ".join(cell.text.strip() for cell in row.cells if cell.text.strip())
                    if row_text:
                        paragraphs.append(row_text)

            full_text = "\n\n".join(paragraphs).strip()
            if not full_text or len(full_text) < 30:
                raise ResumeParseException(
                    "The DOCX file appears to be empty or contains no extractable text."
                )

            # Estimate page count roughly (~450 words/page)
            words = len(full_text.split())
            estimated_pages = max(1, (words // 450) + (1 if words % 450 > 100 else 0))

            return {
                "text": full_text,
                "page_count": estimated_pages,
                "format": "docx"
            }
        except Exception as e:
            if isinstance(e, ResumeParseException):
                raise e
            raise ResumeParseException(f"Error parsing DOCX file: {str(e)}")
