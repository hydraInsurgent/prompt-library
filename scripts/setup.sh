#!/usr/bin/env bash
# plib setup - adds the 'plib' command to your shell profile
# Run once: bash scripts/setup.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PLIB_HOME="$(cd "$SCRIPT_DIR/.." && pwd)"
PLIB_CLI="$PLIB_HOME/cli/plib.js"

# Verify the CLI exists
if [ ! -f "$PLIB_CLI" ]; then
    echo "Error: Could not find cli/plib.js at $PLIB_CLI" >&2
    exit 1
fi

# Detect shell profile
if [ -n "$ZSH_VERSION" ] || [ -f "$HOME/.zshrc" ]; then
    SHELL_RC="$HOME/.zshrc"
elif [ -f "$HOME/.bashrc" ]; then
    SHELL_RC="$HOME/.bashrc"
else
    SHELL_RC="$HOME/.bashrc"
fi

# Check if already installed
if grep -q "# plib - Prompt Library CLI" "$SHELL_RC" 2>/dev/null; then
    echo "plib is already in $SHELL_RC."
    echo "To reinstall, remove the plib block from $SHELL_RC and run again."
    exit 0
fi

# Append the plib function
cat >> "$SHELL_RC" << EOF

# plib - Prompt Library CLI
plib() {
    PLIB_HOME="$PLIB_HOME" node "$PLIB_CLI" "\$@"
}
EOF

echo ""
echo "plib installed successfully!"
echo ""
echo "  PLIB_HOME = $PLIB_HOME"
echo ""
echo "  Reload your shell:  source $SHELL_RC"
echo "  Then run:           plib list"
echo ""
