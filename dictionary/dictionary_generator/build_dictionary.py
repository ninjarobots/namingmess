#!/usr/bin/env python3
"""
Parses a wordlist and creates sublists in the next-level directory (..) based upon contained data.
This should only be run when new sublists need to be created, i.e. when the main list is updated.

The expected format is "<word> <type>: [alternative forms...]"
For example:
dog N: dogs
goose N: geese

N = Noun; V = Verb; A = Adjective/Adverb
"""
from enum import Enum
from os import linesep


class WordClass(Enum):
	"""Maps classes of words (e.g. nouns, verbs) to arbitrary representative values"""
	NOUN = 0
	VERB = 1
	ADJECTIVE = 2
	ADVERB = 3


def parse_wordlist_line(line):
	"""
	Parses a line from a wordlist matching the intended format
	@param line Line from a valid wordlist
	@return A tuple of (string, WordClass), or None if invalid
	"""
	word, word_class, *_ = line.split(' ')  # Unpack list, ignoring values we don't care about
	if not word[0] in ("-", '+'):
		if word_class[0] == 'N': return word, WordClass.NOUN
		if word_class[0] == 'V': return word, WordClass.VERB
		if word_class[0] == 'A':
			if word[-2:] == "ly":  # Look. I'm sorry. Please just let me do this
				return word, WordClass.ADVERB
			return word, WordClass.ADJECTIVE
	return None
			

def main():
	"""Performs overall functionality of file as stated in __doc__"""
	noun_file = open("../noun.txt", "w")
	verb_file = open("../verb.txt", "w")
	adjective_file = open("../adjective.txt", "w")
	adverb_file = open("../adverb.txt", "w")

	with open("words.txt", "r") as f:
		for line in f:
			parsed = parse_wordlist_line(line)
			if parsed:  # Unpack tuple if not None
				word, word_class = parsed
			if   word_class == WordClass.NOUN: noun_file.write("{}{}".format(word, linesep))
			elif word_class == WordClass.VERB: verb_file.write("{}{}".format(word, linesep))
			elif word_class == WordClass.ADJECTIVE: adjective_file.write("{}{}".format(word, linesep))
			elif word_class == WordClass.ADVERB: adverb_file.write("{}{}".format(word, linesep))

	noun_file.close()
	verb_file.close()
	adjective_file.close()
	adverb_file.close()


if __name__ == '__main__':
	main()
