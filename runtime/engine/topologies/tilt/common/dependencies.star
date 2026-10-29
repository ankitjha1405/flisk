# Copyright (c) 2026 Flisk Landscape contributors
# SPDX-License-Identifier: MIT
# =============================================================================
# 🔗 TILT SDK - DECLARED DEPENDENCIES
# =============================================================================
# Purpose: One reading of a manifest's dependsOn for every generator, so the Tilt
#          resource_deps, the frontend env and the nginx map cannot disagree.
# =============================================================================

def declared_dependencies(manifest):
    """The dependency names a manifest declares: `dependsOn`, plus the deprecated `dependencies` key.

    The CLI still reads `dependencies` (see DEPRECATED_FIELDS in service-manifest.ts), so it counts here too. A value that is
    not a list of strings (a hand edit left a string or an object) yields no names instead of failing the whole Tiltfile with
    "string value is not iterable"; `flisk up` and `flisk config verify` report the wrong type.

    Args:
        manifest: Service manifest dict (may be None)

    Returns:
        list: Distinct dependency names in first-seen order
    """
    names = []
    if not manifest:
        return names
    for key in ['dependsOn', 'dependencies']:
        value = manifest.get(key)
        if type(value) != 'list':
            continue
        for entry in value:
            if type(entry) == 'string' and entry not in names:
                names.append(entry)
    return names
