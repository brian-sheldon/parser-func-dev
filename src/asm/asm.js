
// Copyright (C) 2026 Brian Sheldon
//
// MIT License

//
// currently in initial development
// with this being the start of a general
// parser to extract the primary 4 categories
// of parts, labels, op, operands, commments
//
// These parts will then be further processed
// producing further subtypes like for instance
// spliting ops into inst ops and other types
//
// This currently requires the file to have '\r'
// removed and then to be split into lines that
// end with '\n'.  However, I plan to change this
// to more of a stream model, resulting in less
// passes over the data.  This will require a change
// how the comments are handle, using a technique
// similar to how quotes are handled.
//
// The test code at the bottom is temporary
//

let fs = require( 'fs' );

let txt = fs.readFileSync( 'bdos.asm', 'utf8' );

console.log( "src before remove \\r len: " + txt.length );
txt = txt.replaceAll( '\r', '' );
console.log( "src after remove \\r len: " + txt.length );

let lines = txt.split( '\n' );

let src_lines = [];
let words1st = new Set();

let warnings = 0;
let errors = 0;

function new_word() {
  let word = {};
  word.type = '';
  word.index = 0;
  word.pos = 0;
  word.word = '';
  return word;
}

function parse_line( line ) {
  let words = [];
  let pos = 0;
  let len = line.length;
  let wordindex = 0;
  let word = new_word();
  let inblock_end = '';
  let inblock = false;
  let next = 'op';
  while ( pos < len ) {
    let ch = line.charAt( pos );
    if ( inblock ) {
      word.word += ch;
      if ( ch == inblock_end ) inblock = false;
    } else if ( ch == ' ' || ch == '\t' ) {
      if ( word.word != '' ) {
        if ( word.pos == 0 ) {
          word.type = 'label';
        } else {
          if ( next == 'op' ) {
            word.type = next;
            next = 'operand';
          } else {
            word.type = next;
            word.index = wordindex++;
          }
        }
        words.push( word );
        word = new_word();
      }
    } else if ( ch == ';' ) {
      word.type = 'comment';
      word.pos = pos;
      word.word = line.slice( pos );
      words.push( word );
      word = new_word();
      pos = len;
    } else {
      if ( ch == ':' ) {
        word.type = 'label:';
        word.word += ch;
        words.push( word );
        word = new_word();
      } else {
        if ( ch == ',' ) {
          if ( next == 'op' ) {
            word.type = next;
            next = 'operand';
          } else {
            word.type = next;
            word.index = wordindex++;
          }
          words.push( word );
          word = new_word();
          word.type = 'comma';
          word.pos = pos;
          word.word = ch;
          words.push( word );
          word = new_word();
        } else {
          if ( word.word == '' ) word.pos = pos;
          if ( ch == '\'' || ch == '"' ) {
            if ( word.word != '' ) {
              console.log( "quote not at beginning of word ..." );
              warnings++;
            }
            inblock_end = ch;
            inblock = true;
          }
          if ( ch == '(' ) {
            inblock_end = ')';
            inblock = true;
          }
          word.word += ch;
        }
      }
    }
    pos++;
  }
  if ( word.word != '' ) {
    word.type = 'operand';
    word.index = wordindex;
    words.push( word );
  }
  return words;
}

let args = process.argv.slice( 2 );

let numlines = lines.length;

let show = false;
if ( args[0] == 'show' ) show = true;
let num = args[1] ? parseInt( args[1] ) : numlines ;
let beg = args[2] ? parseInt( args[2] ) : 0 ;

for ( let l = beg; l < beg + num; l++ ) {
  let line = lines[l];
  let words = parse_line( line );
  let src_line = {};
  src_line.linenum = l + 1;
  src_line.orig = line;
  src_line.addr = 0;
  src_line.words = words;
  src_lines.push( src_line );
  if ( words.length > 0 ) {
    for ( let i = 0; i < words.length; i++ ) {
      let word = words[i];
      if ( word.type == 'op' ) {
        words1st.add( word.word );
      }
    }
  }
  if ( show ) {
    console.log( '*'.repeat( 60 ) );
    console.log( src_line );
  }
}

console.log( "warnings: " + warnings );

console.log( words1st );





