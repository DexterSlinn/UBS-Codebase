# UBS Knowledge Base

This directory contains the knowledge base documents that Marcel the UBS AI Guide uses to provide accurate information about UBS Switzerland services.

## How to Add Documents

1. **File Format**: Add `.txt` or `.md` files to this directory
2. **File Naming**: Use descriptive filenames that indicate the content (e.g., `banking-services.md`, `investment-options.txt`)
3. **Categories**: The system automatically categorizes documents based on filename keywords:
   - Files containing "banking" or "account" → `banking` category
   - Files containing "investment" or "trading" → `investment` category
   - Files containing "policy" or "terms" → `policy` category
   - Files containing "faq" or "help" → `faq` category
   - All others → `general` category

## Document Structure

### For Markdown files (.md):
```markdown
# Document Title

## Section 1
Content here...

## Section 2
More content...
```

### For Text files (.txt):
```
Document Title

Section 1
Content here...

Section 2
More content...
```

## Automatic Processing

- The system automatically scans this directory on startup
- Documents are cached for performance
- Cache is refreshed when files are modified
- The assistant searches through all documents to provide relevant information

## Sample Document

A sample UBS services document (`ubs-services.md`) is automatically created when the system starts for the first time.

## Best Practices

1. **Keep documents focused**: Each file should cover a specific topic or service
2. **Use clear headings**: Structure content with clear sections
3. **Include relevant keywords**: Use terms that users might search for
4. **Update regularly**: Keep information current and accurate
5. **Avoid duplicates**: Don't repeat the same information across multiple files

## Testing

You can test the knowledge base search functionality using the API endpoint:
```
POST /api/knowledge-base/search
{
  "query": "your search terms",
  "maxResults": 5
}
```