
// Copyright (C) 2026 Brian Sheldon
//
// MIT License

//
// currently used in project emu-sys in folders
// - src/emu-esp32/util.h
// - src/emu-linux/util.h
//

#include <stdlib.h>
#include <stdint.h>
#include <string.h>
#include <stdbool.h>

//
// Allows the default radix to be set as there are cases where it makes
// sense to have the default radix be 16 to avoid having to constantly
// use prefixes.  In order to still allow decimal value entry, the '#'
// has been added as a prefix for force the radix to be decimal.
//
// Signs are also supported and are usually always the first character.
// However, as it is also common to prefix numbers with the '#' sign as is
// common in assemblers, this parser allows the sign to be used immediately
// after the '#'.  But due to the dual nature of the use fo teh '#' in this
// parser, the '#' can also come after the sign so as to be consistent with
// the other prefixes that are used for a non-base 10 radix.
//
// So the following are examples of the number syntaxes are allowed.
//
// 1920 - would be whatever the default radix is
// #1920 = radix 10, eec
// $1920 = radix 16, hex
// 0x1920 - radix 16, hex
// %11001 - radix 2, binary
// 0b11001 - radix 2, binary
// -0x02bf - radix 16, negative hex num
// 0o275 - radix 8, octal
// #0xfc - radix 16, hex
// #-0xfc = radix 16, necative hex num
// -#128 = radix 10, negative dec num, nto a standard format
// #-128 - same as above
//

long pnum( char *word, int radix ) {
  int len = strlen( word );
  char sign = '+';
  long val = 0;
  int pos = 0;
  if ( pos < len && word[ pos ] == '#' ) {
    radix = 10;
    pos++;
  }
  if ( pos < len && ( word[ pos ] == '-' || word[ pos ] == '+' ) ) {
    sign = word[ pos ];
    pos++;
  }
  if ( pos < len ) {
    if ( word[ pos ] == '$' ) {
      radix = 16;
      pos++;
    } else if ( word[ pos ] == '#' ) {
      radix = 10;
      pos++;
    } else if ( word[ pos ] == '%' ) {
      radix = 2;
      pos++;
    } else if ( word[ pos ] == '0' ) {
      pos++;
      // many legacy systems assumed a leading 0 inticated octal
      // not recommended as it is common to enter hex with leading 0s to keep consistent length
      // uncommenting the following line will use the legacy way
      //radix = 8;
      if ( pos < len ) {
        if ( word[ pos ] == 'x' || word[ pos ] == 'X' ) {
          radix = 16;
          pos++;
        } else if ( word[ pos ] == 'b' || word[ pos ] == 'B' ) {
          radix = 2;
          pos++;
        } else if ( word[ pos ] == 'o' || word[ pos ] == 'O' || word[ pos ] == 'q' || word[ pos] == 'Q' ) {
          radix = 8;
          pos++;
        }
      } else {
        pos--; // for when a lone zero is entered
      }
    }
  }
  char *endptr;
  val = strtol( word + pos, &endptr, radix );
  bool success = true;
  if ( ( word + pos ) == endptr ) {
    println( "error not a number ..." );
    success = false;
  } else if ( ( word + len ) == endptr ) {
    success = true;
  } else {
    println( "error non-number chars found ..." );
    success = false;
  }
  if ( success ) {
    if ( sign == '-' ) {
      val = -val;
    }
  } else {
    val = 0;
  }
  //printf( "word: %s radix: %d sign: %c success: %d rem: %ld\n", word, radix, sign, success, val );
  return val;
}




