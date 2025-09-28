#!/bin/bash
# Force all filenames and directories to lowercase, excluding .git folder

set -e

# Loop through all files and directories (deep), excluding .git
find . -depth -not -path "./.git/*" | while read SRC; do
  DST=$(dirname "${SRC}")/$(basename "${SRC}" | tr 'A-Z' 'a-z')
  if [ "${SRC}" != "${DST}" ]; then
    echo "Renaming: $SRC -> $DST"
    git mv -f "$SRC" "$DST"
  fi
done


