from codebase_to_text import CodebaseToText

code_to_text = CodebaseToText(
    input_path='app',
    output_path="backend_code.txt",             # where to save the result
    output_type="txt",                  # output format
    verbose=True,                       # show logging output
    exclude_hidden=True,                 # skip hidden files like .git, .env, etc.
)

code_to_text.get_file()