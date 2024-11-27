{ pkgs }: {
  # Which nixpkgs channel to use.
  channel = "stable-24.05"; # or "unstable"

  # Use https://search.nixos.org/packages to find packages
  # Install pnpm
  packages = [
    pkgs.nodejs_20
  ];

  env = {
    # ... other environment variables ...
    PATH = [
      # ... other paths ...
      # Add this to include the directory where pnpm is installed
      "${pkgs.nodejs}/bin"
      "/home/user/.local/share/pnpm" # adjust if your pnpm install location is different
    ];
    PORT = "3000"; # Default port for the application
  };

  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      # "vscodevim.vim"
      "esbenp.prettier-vscode"
      "dbaeumer.vscode-eslint"
      "mhutchie.git-graph"
    ];
    workspace = {
      # Runs when a workspace is first created with this `dev.nix` file
      onCreate = {
        pnpm-install = "pnpm ci --no-audit --prefer-offline --no-progress --timing";
        # Open editors for the following files by default, if they exist:
        default.openFiles = [
          "src/app/page.tsx"
          "src/app/page.jsx"
        ];
      };
      # To run something each time the workspace is (re)started, use the `onStart` hook
      onStart = {
        install = "pnpm install";
        build = "pnpm build";
        format = "pnpm format";
      };

    };

    previews = {
      enable = true;
      previews = {
        web = {
          # Use `--hostname` and ensure $PORT is passed correctly
          command = [ "sh" "-c" "PORT=3000 next dev --hostname 0.0.0.0 --port $PORT" ];
          manager = "web";
        };
      };
    };

  };
}
