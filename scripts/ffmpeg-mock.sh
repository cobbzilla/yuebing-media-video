#!/bin/sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
MOCK_DATA="${SCRIPT_DIR}"/mock_data

OUTFILE="${!#}"
OUT_DIR="$(dirname "${OUTFILE}")"

ASSET_PREFIX=""
ASSET_SIZE=""

for arg in "$@"; do
  if [ "$arg" = "-map" ]; then
    ASSET_PREFIX="dash"
    break
  fi
  if [ "$arg" = "-accurate_seek" ] ; then
    ASSET_PREFIX="firstThumbnail_"
  fi
  if [ "$arg" = "fps=1/60" ] ; then
    ASSET_PREFIX="thumbnails_"
  fi
  if [ "$arg" = "hd1080" ] ; then
    ASSET_SIZE="large"
  fi
  if [ "$arg" = "hd720" ] ; then
    ASSET_SIZE="medium"
  fi
  if [ "$arg" = "vga" ] ; then
    ASSET_SIZE="small"
  fi
done

if [ -z "${ASSET_PREFIX}" ] ; then
  echo >&2 "Error: unrecognized ffmpeg arguments: $*"
  exit 1
fi

ASSET_DIR="${MOCK_DATA}"/${ASSET_PREFIX}${ASSET_SIZE}
if [ ! -d "${ASSET_DIR}" ] ; then
  echo >&2 "Error: mock asset directory not found: ${ASSET_DIR}"
  exit 1
fi

if [ ${ASSET_PREFIX} = "dash" ] ; then
  sleep 5
else
  sleep 2
fi

mkdir -p "${OUT_DIR}"
cp "${ASSET_DIR}"/* "${OUT_DIR}"/
exit 0
