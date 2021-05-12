"""
add_headers.py written by Rafael Goldstein

Goes through all files we wrote ourselves and adds our custom header

TODO://
1) Add specific title for the name we choose for the extension. This should go
under APP_TITLE in line 16.
2) In root directory run `python3 add_headers.py` on the CL
3) Push changes to main branch

"""
import os

# here are our constants
APP_TITLE = "PLACEHOLDER TITLE"
HEADER = "/*\n" + APP_TITLE + " is licensed under the MIT License \nCopyright (c) 2021 Owen Kaplan, David Baraka, Rafael Goldstein, Daniel Goldelman, Logan Brown, Sebastian Zimmeck \n" + "*/\n"
DIR = "src"

# iterate through directory, open up all the right js files, add this header to top
# and get on with our day!
for subdir, dirs, files in os.walk(DIR):
    for file in files:
        filepath = subdir + os.sep + file
        if filepath.endswith(".js"):
            with open(filepath, 'r') as original: data = original.read()
            with open(filepath, 'w') as modified: modified.write(HEADER + data)
