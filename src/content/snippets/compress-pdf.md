---
title: 'Compress PDF'
description: 'Shell script to compress PDF files using Ghostscript with optimal settings'
tags:
  - Mac OS
  - Terminal
image: CodeScreenshot.png
updated: 2022-12-01
published: 2022-12-01
---

1. Install ghostscript: `brew install ghostscript`.
2. Save the following script as `compress-pdf.sh`.

```bash
#!/bin/bash
input=$1
tmp="-tmp.pdf"
output="${input/.pdf/$tmp}"
echo "Compressing..."
gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile=$output $input && \
echo "Shuffling some files around..." && \
rm $input && \
mv $output $input && \
echo "Done!"
```

3. Make the script executable: `chmod +x compress-pdf.sh`.
4. Run the script: `./compress-pdf.sh <filename.pdf>`.
5. (Optional) Create an alias in your `.bash_profile` or `.zshrc` file: `alias compress-pdf='./compress-pdf.sh'`.
