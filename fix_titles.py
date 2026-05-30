import os
import glob

# Files to patch
files = glob.glob('src/app/frontend/*/page.tsx')
files.append('src/app/u/[slug]/page.tsx')

for file_path in files:
    with open(file_path, 'r') as f:
        content = f.read()
    
    # For dashboard pages
    if 'fp-sidebar__profile' in content:
        # replace the profile name rendering with the title rendering added below it
        if '{profile?.nombre_completo ?? "Usuario"}' in content:
            # check if it already has titulo_profesional
            if 'profile?.titulo_profesional' not in content:
                content = content.replace(
                    '{profile?.nombre_completo ?? "Usuario"}\n                  </p>',
                    '{profile?.nombre_completo ?? "Usuario"}\n                  </p>\n                  {profile?.titulo_profesional && (\n                    <p className="fp-body-sm fp-muted" style={{ margin: 0, fontSize: "0.75rem" }}>\n                      {profile.titulo_profesional}\n                    </p>\n                  )}'
                )

    # For mi-cuenta which uses displayName
    if file_path.endswith('mi-cuenta/page.tsx'):
        content = content.replace(
            '{profile?.titulo_profesional || "Título profesional no especificado"}',
            '{profile?.titulo_profesional}'
        )

    # For public profile
    if file_path.endswith('u/[slug]/page.tsx'):
        content = content.replace(
            '{perfil.titulo_profesional || "Título profesional no especificado"}',
            '{perfil.titulo_profesional}'
        )

    with open(file_path, 'w') as f:
        f.write(content)
