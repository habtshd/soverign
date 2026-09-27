Add-Type -AssemblyName System.Drawing
$inputPath = Join-Path (Get-Location) "client\public\logo-light.jpg"
$outputPath = Join-Path (Get-Location) "client\public\logo-light.png"

$bmp = [System.Drawing.Bitmap]::FromFile($inputPath)
$rect = New-Object System.Drawing.Rectangle(0, 0, $bmp.Width, $bmp.Height)
$output = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

# Use LockBits for high-performance pixel manipulation
$bmpData = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$outData = $output.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$byteCount = [Math]::Abs($bmpData.Stride) * $bmp.Height
$rgbValues = New-Object byte[] $byteCount
$outValues = New-Object byte[] $byteCount

[System.Runtime.InteropServices.Marshal]::Copy($bmpData.Scan0, $rgbValues, 0, $byteCount)

for ($i = 0; $i -lt $byteCount; $i += 4) {
    $b = $rgbValues[$i]
    $g = $rgbValues[$i+1]
    $r = $rgbValues[$i+2]
    # Check if near-white/light-background
    if ($r -gt 235 -and $g -gt 235 -and $b -gt 235) {
        $outValues[$i] = 0
        $outValues[$i+1] = 0
        $outValues[$i+2] = 0
        $outValues[$i+3] = 0 # Transparent
    } elseif ($r -gt 215 -and $g -gt 215 -and $b -gt 215) {
        # Soft blend edge
        $avg = ($r + $g + $b) / 3.0
        $alpha = [byte][Math]::Max(0, [Math]::Min(255, (235 - $avg) * 12.75))
        $outValues[$i] = $b
        $outValues[$i+1] = $g
        $outValues[$i+2] = $r
        $outValues[$i+3] = $alpha
    } else {
        $outValues[$i] = $b
        $outValues[$i+1] = $g
        $outValues[$i+2] = $r
        $outValues[$i+3] = 255
    }
}

[System.Runtime.InteropServices.Marshal]::Copy($outValues, 0, $outData.Scan0, $byteCount)

$bmp.UnlockBits($bmpData)
$output.UnlockBits($outData)
$bmp.Dispose()

$output.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$output.Dispose()
Write-Output "Successfully replaced logo-light.png with a truly transparent PNG!"
