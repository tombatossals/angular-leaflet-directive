#!/usr/bin/env python
# vim: sts=4 sw=4 et

import os, sys

printed = set()

def includes(f):
    d = os.path.dirname(f)
    for l in open(f):
        if l.startswith('//#include'):
            yield os.path.join(d, l.strip().split(None, 1)[1].strip(""""'"""))

work = list(sys.argv[1:])

while work:
    f = work.pop(0)
    if f in printed:
        continue
    i = list(filter(lambda x: x not in printed, includes(f)))
    if i:
        work = i + [f] + work
        continue
    printed.add(f)
    print f

