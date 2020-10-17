#!/bin/sh

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR

find ./posts -name "*.md" | while read MDF
do
	MDFN=`basename $MDF .md`
	sed -i -e "s/\](${MDFN}\//\](\.\/${MDFN}\//g" $MDF
	sed -i -e "s/src=\"${MDFN}\//src=\"\.\/${MDFN}\//g" $MDF
done

git add --all
git commit -m "$1"
git push