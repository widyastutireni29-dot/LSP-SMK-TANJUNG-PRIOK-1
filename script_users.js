const fs = require('fs');
const data = `siswa1|Andhika Wahid Syawaludin|123456|XII MK|2026/2027
siswa2|Fakhri Jasmi Raziq|123456|XII MK|2026/2027
siswa3|Hidayatur Raihan|123456|XII MK|2026/2027
siswa4|Iqbal Marvel Saputra|123456|XII MK|2026/2027
siswa5|Joshua Devis Morenza|123456|XII MK|2026/2027
siswa6|Juanito Sabono Elath|123456|XII MK|2026/2027
siswa7|Kevin Juliyan|123456|XII MK|2026/2027
siswa8|Mochammad Dava Fiadeyo|123456|XII MK|2026/2027
siswa9|Muhamad Vickry Pratama|123456|XII MK|2026/2027
siswa10|Muhammad Farhan Maulana|123456|XII MK|2026/2027
siswa11|Muhammad Rizqy Akbar|123456|XII MK|2026/2027
siswa12|Muhammad Rio Febrian|123456|XII MK|2026/2027
siswa13|Muhammad Zahran Kusuma|123456|XII MK|2026/2027
siswa14|Nabil Al Fajar Thaher|123456|XII MK|2026/2027
siswa15|Putra Fajar|123456|XII MK|2026/2027
siswa16|Rayhanul Hakim|123456|XII MK|2026/2027
siswa17|Rifa Dwiky Padiansyah|123456|XII MK|2026/2027
siswa18|Rizki Farel Novriansyah|123456|XII MK|2026/2027
siswa19|Rizky Aditya|123456|XII MK|2026/2027
siswa20|Satria Aloeyza|123456|XII MK|2026/2027
siswa21|Sigit Wahyudi|123456|XII MK|2026/2027
siswa22|Yusuf AlMuttaqin|123456|XII MK|2026/2027
siswa23|siswa|123456|XII MK|2026/2027
siswa24|Alvino Pratama|123456|XII MO|2026/2027
siswa25|Audry|123456|XII MO|2026/2027
siswa26|Aulia Dwi Akbar Prasetyo|123456|XII MO|2026/2027
siswa27|Chodari|123456|XII MO|2026/2027
siswa28|Dava Arya Pratama|123456|XII MO|2026/2027
siswa29|Descam Danuarta|123456|XII MO|2026/2027
siswa30|Fahri Fiyra Armanda|123456|XII MO|2026/2027
siswa31|Fahri Pratama Mulya|123456|XII MO|2026/2027
siswa32|Farhan Septiana Ramadani|123456|XII MO|2026/2027
siswa33|Farrel Ferdinand|123456|XII MO|2026/2027
siswa34|Farid Rodikin|123456|XII MO|2026/2027
siswa35|Farlie Lailatul Qodri Laturuo|123456|XII MO|2026/2027
siswa36|Ibrahimovic Irwansyah|123456|XII MO|2026/2027
siswa37|Khoeru Dzikri|123456|XII MO|2026/2027
siswa38|Marcel Diandra Saputra|123456|XII MO|2026/2027
siswa39|Muhamad Aldi|123456|XII MO|2026/2027
siswa40|Muhamad Arif Atbar|123456|XII MO|2026/2027
siswa41|Muhammad Aqil Ilham|123456|XII MO|2026/2027
siswa42|Muhammad Fathir Al Qahtani|123456|XII MO|2026/2027
siswa43|Muhammad Firmansyah|123456|XII MO|2026/2027
siswa44|Muhammad Ibrahim Solihin Put|123456|XII MO|2026/2027
siswa45|Muhammad Rasya Assidiq|123456|XII MO|2026/2027
siswa46|Muhammad Rival Anwar|123456|XII MO|2026/2027
siswa47|Muhammad Rizky Zulkarnain|123456|XII MO|2026/2027
siswa48|Muhammad Syahrul Ramadhan|123456|XII MO|2026/2027
siswa49|Nabil Syahputra|123456|XII MO|2026/2027
siswa50|Naufal Daffa Avin|123456|XII MO|2026/2027
siswa51|Nur Khasan|123456|XII MO|2026/2027
siswa52|Putra Nizar Muttaqin|123456|XII MO|2026/2027
siswa53|Rafi Ananda Saputra|123456|XII MO|2026/2027
siswa54|Rifqi Irfani|123456|XII MO|2026/2027
siswa55|Rizki Aulia Putra|123456|XII MO|2026/2027
siswa56|Sultan Kaffi Al Fajri|123456|XII MO|2026/2027
siswa57|Tanzilal Nata Prawira|123456|XII MO|2026/2027
siswa58|Yuda Saputra|123456|XII MO|2026/2027
siswa59|Abian kautsar bahry|123456|XII DKV|2026/2027
siswa60|Ahmad Wildan Ramdani|123456|XII DKV|2026/2027
siswa61|Andika Pratama|123456|XII DKV|2026/2027
siswa62|Aqilla Yasmin|123456|XII DKV|2026/2027
siswa63|Christian Immanuel Purba|123456|XII DKV|2026/2027
siswa64|Fadhil Rifqi Khairan|123456|XII DKV|2026/2027
siswa65|Fathin Hafizh Darmawan|123456|XII DKV|2026/2027
siswa66|Gamaliel Josevanno Paskah Tu|123456|XII DKV|2026/2027
siswa67|Julian Afdillah|123456|XII DKV|2026/2027
siswa68|Kalyca Tahara Azula Setiawan|123456|XII DKV|2026/2027
siswa69|Mourinho Gerrard|123456|XII DKV|2026/2027
siswa70|Muhamad Rizky Januar Laturu|123456|XII DKV|2026/2027
siswa71|Muhammad Rasya Izhar Maligy|123456|XII DKV|2026/2027
siswa72|Muhammad Rizky Ramadhan|123456|XII DKV|2026/2027
siswa73|Nayla Qonsarry Arti Utomo|123456|XII DKV|2026/2027
siswa74|Nayra Alma Shafina|123456|XII DKV|2026/2027
siswa75|Pangeran faadhil Hizbullah|123456|XII DKV|2026/2027
siswa76|Putra Janabi Nurnaaji|123456|XII DKV|2026/2027
siswa77|Raihan Dwi Rahadi|123456|XII DKV|2026/2027
siswa78|Raihan Galih Pratama|123456|XII DKV|2026/2027
siswa79|Reval Setio|123456|XII DKV|2026/2027
siswa80|Septiawan Saputra Bateh|123456|XII DKV|2026/2027
siswa81|Sesha Kurniasih|123456|XII DKV|2026/2027
siswa82|Silviana Febriyanti|123456|XII DKV|2026/2027
siswa83|Tiara Anggraeni|123456|XII DKV|2026/2027
siswa84|Yuliyana Putri|123456|XII DKV|2026/2027
siswa85|Afdhan Afdhillah Ruz|123456|XII TL|2026/2027
siswa86|Bangbang Irawan|123456|XII TL|2026/2027
siswa87|Dzaky Abdul Aziz|123456|XII TL|2026/2027
siswa88|Fathir Alinsky Canavaro|123456|XII TL|2026/2027
siswa89|Hanifah Azzahra|123456|XII TL|2026/2027
siswa90|I Kadek Chandra Satrya|123456|XII TL|2026/2027
siswa91|Indra Damar Al-Sampurna|123456|XII TL|2026/2027
siswa92|Izhar Habib Musyaffa|123456|XII TL|2026/2027
siswa93|Khairul Annam|123456|XII TL|2026/2027
siswa94|Melia Putri|123456|XII TL|2026/2027
siswa95|Merisa Kumala Sari|123456|XII TL|2026/2027
siswa96|Mufti Muzaki Agusta|123456|XII TL|2026/2027
siswa97|Muhammad Firdaus Tri Saputr|123456|XII TL|2026/2027
siswa98|Muhammad Sofiansyah|123456|XII TL|2026/2027
siswa99|Naufal Musyaffa|123456|XII TL|2026/2027
siswa100|Ria Sabitha Zein|123456|XII TL|2026/2027
siswa101|Tegar Setiawan|123456|XII TL|2026/2027`;

const lines = data.split('\n').filter(l => l.trim().length > 0);
const users = lines.map(line => {
  const parts = line.split('|').map(p => p.trim());
  const id = parts[0];
  const name = parts[1];
  const pass = parts[2];
  const kelasStr = parts[3];
  
  let jurusan = 'TKRO';
  if (kelasStr.includes('DKV')) jurusan = 'DKV';
  else if (kelasStr.includes('MK')) jurusan = 'MK';
  else if (kelasStr.includes('MO')) jurusan = 'MO';
  else if (kelasStr.includes('TL')) jurusan = 'TL';
  
  return `  { id: '${id}', email: '${id}@siswa.sch.id', nisn: '${id}', name: '${name}', role: 'asesi', password: '${pass}', kelas: '${kelasStr}', jurusan: '${jurusan}', tahun_ajaran: '2026/2027' },`;
});

const file = fs.readFileSync('apps/web/src/store/index.js', 'utf8');
const newFile = file.replace(`  { id: 'siswa-4', nisn: '0054321990', name: 'Rina Sari', email: 'rina@siswa.sch.id', role: 'asesi', password: 'siswa123', kelas: 'XII DKV 2', jurusan: 'DKV', ttl: 'Jakarta, 15 Apr 2007', alamat: 'Jl. Martadinata No. 21, Penjaringan', noHp: '081234567893' },`, 
`  { id: 'siswa-4', nisn: '0054321990', name: 'Rina Sari', email: 'rina@siswa.sch.id', role: 'asesi', password: 'siswa123', kelas: 'XII DKV 2', jurusan: 'DKV', ttl: 'Jakarta, 15 Apr 2007', alamat: 'Jl. Martadinata No. 21, Penjaringan', noHp: '081234567893' },\n` + users.join('\n'));

fs.writeFileSync('apps/web/src/store/index.js', newFile);
console.log('Success inserted arrays!');
