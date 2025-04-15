import fs from 'fs';
import archiver from 'archiver';

const output = fs.createWriteStream('bulletbox.zip');
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`📦 Created zip: ${archive.pointer()} bytes`);
});

archive.on('error', (e) => {
  throw e;
});

archive.pipe(output);
archive.file('manifest.json')
archive.directory('dist/');
archive.directory('res/', false);
archive.finalize();
