# Various parser functions, some in use, some in initial development

I have found myself building various parsers over the years to perform various specific functions, often only needed for a particular task.  However, I often lose track of these parsers and find myself requiring another one with very similar requirements.  Plus some that are in active use, are often found in various projects, so when I require this same functionality, I have to once again go through some effort to find them.  I have therefore decided to keep a copy of all these parser like functions in one place.  Plus I am also boing to use this as the initial place to start new parser development.

### pnum.js

This one is in active use within the emu-sys project.  It was the initial variant of this function I developed, so the code may need some cleanup.

### pnum.c

A C version of the js function above.  This one may be a little more mature as it was my second time performing this type of parsing.

### asm.js

Just a very preliminary version of a general ASM parser, able to parse each assembly line into the 4 parts, label, op, operands and comments.  The first primary use of this, will be to do various function involving ASM source, like for instance extracting a list of all ops used or of all symbols found.  Other initial functions may be to produce better formatted source and maybe perform basic replacement functions to make code compatible with a particular assembler.  It is possible, that I may build an assembler in the future using this.






