#!/bin/sh
zip -r soulextractor.xpi * --exclude ${0##*/} --exclude .git/\* --exclude logo.svg