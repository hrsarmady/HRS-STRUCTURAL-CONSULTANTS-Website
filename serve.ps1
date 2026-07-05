param(
    [int]$Port = 8000
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()

Write-Host "Serving $root at http://localhost:$Port"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        try {
            $relativePath = [Uri]::UnescapeDataString($context.Request.Url.AbsolutePath.TrimStart('/'))

            if ([string]::IsNullOrWhiteSpace($relativePath)) {
                $relativePath = "index.html"
            }

            $requestedPath = [IO.Path]::GetFullPath((Join-Path $root $relativePath))
            $rootPath = [IO.Path]::GetFullPath($root) + [IO.Path]::DirectorySeparatorChar

            if (-not $requestedPath.StartsWith($rootPath, [StringComparison]::OrdinalIgnoreCase) -or
                -not [IO.File]::Exists($requestedPath)) {
                $context.Response.StatusCode = 404
                $context.Response.Close()
                continue
            }

            $contentTypes = @{
                ".html" = "text/html; charset=utf-8"
                ".css"  = "text/css; charset=utf-8"
                ".js"   = "text/javascript; charset=utf-8"
                ".json" = "application/json; charset=utf-8"
                ".svg"  = "image/svg+xml"
                ".png"  = "image/png"
                ".jpg"  = "image/jpeg"
                ".jpeg" = "image/jpeg"
                ".webp" = "image/webp"
            }

            $extension = [IO.Path]::GetExtension($requestedPath).ToLowerInvariant()
            $context.Response.ContentType = if ($contentTypes.ContainsKey($extension)) {
                $contentTypes[$extension]
            } else {
                "application/octet-stream"
            }
            $bytes = [IO.File]::ReadAllBytes($requestedPath)
            $context.Response.ContentLength64 = $bytes.Length
            $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
            $context.Response.Close()
        }
        catch {
            try { $context.Response.Abort() } catch {}
        }
    }
}
finally {
    $listener.Stop()
    $listener.Close()
}
