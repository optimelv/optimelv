from pathlib import Path
import subprocess, os
p=Path(__file__).resolve().parent.parent
ff=os.environ.get('FFMPEG', 'ffmpeg')
for name in ['margin','relay']:
 for mobile in [False,True]:
  key=name+('-mobile' if mobile else '')
  # Keep the title and frame still; animate only the illustrated application.
  w,h,x,y=(736,608,32,260) if mobile else (675,390,495,30)
  bg='efe9d9' if name=='margin' else '000000'
  # A brief fade into the next replay prevents a hard end-to-start cut.
  base='[0:v]pad=800:900:0:0:color=0x121a16[base];' if mobile else '[0:v]null[base];'
  filt=base+f'[1:v]scale={w}:{h}:force_original_aspect_ratio=decrease:force_divisible_by=2,pad={w}:{h}:(ow-iw)/2:(oh-ih)/2:color=0x{bg},setsar=1,fade=t=in:st=0:d=0.3:color=0x{bg},fade=t=out:st=11.6:d=0.4:color=0x{bg}[demo];[base][demo]overlay={x}:{y}:shortest=1,scale=800:-1,split[a][b];[a]palettegen=max_colors=128:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle'
  dest=p/f'assets/projects/{key}-demo-v1.gif'
  subprocess.run([ff,'-hide_banner','-loglevel','error','-y','-loop','1','-framerate','10','-i',str(p/f'assets/projects/{key}.png'),'-framerate','10','-i',f'/private/tmp/profile-demo-frames/{key}/%04d.png','-filter_complex',filt,'-t','12','-loop','0',str(dest)],check=True)
  print(key,round(dest.stat().st_size/1024),'KB',flush=True)
