import React from 'react';
import {
  ClassLevel,
  Extracurricular,
  SchoolIdentity,
  SemesterType,
  Student,
  Subject
} from '../../types';
import { getNamaPelajaranAgama } from '../../utils/tpDescriptionHelper';

export interface AcademicScoreRowItem {
  mapel: Subject;
  score: {
    kkm?: number;
    formatif?: number;
    nilaiPts?: number;
    nilaiAkhir: number;
    predikat?: string;
    capaianKompetensi?: string;
    deskripsiRapor: string;
    deskripsiTercapai: string;
    deskripsiPerluPeningkatan: string;
  };
  linkedTpKodes?: string[];
}

interface ReportAcademicHeaderAndScoresProps {
  student: Student;
  sekolah: SchoolIdentity;
  selectedKelas: ClassLevel;
  selectedFase: string;
  semester: SemesterType;
  studentScores: AcademicScoreRowItem[];
}

export const ReportAcademicHeaderAndScores: React.FC<ReportAcademicHeaderAndScoresProps> = ({
  student,
  sekolah,
  selectedKelas,
  selectedFase,
  semester,
  studentScores
}) => {
  const isSem2 = semester === 'Genap' || semester === '2';
  const cleanNisn =
    student.nisn && !student.nisn.startsWith('BLM_') && student.nisn !== '-'
      ? student.nisn
      : '-';
  const cleanNis = student.nis && student.nis !== '-' ? student.nis : '';
  const nisDisplay = cleanNis ? `${cleanNisn} / ${cleanNis}` : cleanNisn;

  // Pisahkan mata pelajaran umum (Wajib/Pilihan) dan Muatan Lokal seperti format resmi Kurikulum Merdeka
  const mainScores = studentScores.filter((item) => item.mapel.kelompok !== 'Muatan Lokal');
  const mulokScores = studentScores.filter((item) => item.mapel.kelompok === 'Muatan Lokal');

  const renderScorePairRows = (item: AcademicScoreRowItem, displayNo: number | string) => {
    const mapelTitle = getNamaPelajaranAgama(item.mapel.mataPelajaran, student.agama);
    const hasScore = item.score.nilaiAkhir > 0;
    const upperDesc =
      item.score.deskripsiTercapai?.trim() ||
      (item.score.deskripsiRapor && item.score.deskripsiRapor !== '-' ? item.score.deskripsiRapor : '');
    const lowerDesc = item.score.deskripsiPerluPeningkatan?.trim() || '';

    return (
      <React.Fragment key={item.mapel.kode || item.mapel.mataPelajaran}>
        <tr className="bg-white">
          <td
            rowSpan={2}
            className="border border-black py-1.5 px-2 text-center align-middle font-normal"
          >
            {displayNo}
          </td>
          <td
            rowSpan={2}
            className="border border-black py-1.5 px-2.5 text-left align-middle font-normal text-black"
          >
            {mapelTitle}
          </td>
          <td
            rowSpan={2}
            className="border border-black py-1.5 px-2 text-center align-middle font-normal text-black"
          >
            {hasScore ? item.score.nilaiAkhir : ''}
          </td>
          <td className="report-desc-cell border border-black py-1.5 px-2.5 align-top leading-snug text-black min-h-[26px]">
            {upperDesc ? (
              <span>{upperDesc}</span>
            ) : (
              <span className="inline-block h-4" />
            )}
          </td>
        </tr>
        <tr className="bg-white">
          <td className="report-desc-cell border border-black py-1.5 px-2.5 align-top leading-snug text-black min-h-[26px]">
            {lowerDesc ? (
              <span>{lowerDesc}</span>
            ) : (
              <span className="inline-block h-4" />
            )}
          </td>
        </tr>
      </React.Fragment>
    );
  };

  return (
    <div className="text-black">
      {/* JUDUL LAPORAN HASIL BELAJAR (SESUAI FORMAT KURIKULUM MERDEKA) */}
      <div className="text-center mb-5">
        <h2 className="text-sm sm:text-base font-bold tracking-wide uppercase text-black">
          LAPORAN HASIL BELAJAR
        </h2>
      </div>

      {/* IDENTITAS PESERTA DIDIK & SEKOLAH (2 KOLOM RATA) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-xs mb-4">
        <div className="space-y-1">
          <div className="flex">
            <span className="w-36 shrink-0">Nama Peserta Didik</span>
            <span className="w-3 text-center shrink-0">:</span>
            <span className="font-bold uppercase text-black flex-1">{student.namaSiswa}</span>
          </div>
          <div className="flex">
            <span className="w-36 shrink-0">NISN</span>
            <span className="w-3 text-center shrink-0">:</span>
            <span className="font-normal text-black flex-1">{nisDisplay}</span>
          </div>
          <div className="flex">
            <span className="w-36 shrink-0">Sekolah</span>
            <span className="w-3 text-center shrink-0">:</span>
            <span className="font-normal text-black flex-1">{sekolah.namaSekolah || '-'}</span>
          </div>
          <div className="flex">
            <span className="w-36 shrink-0">Alamat</span>
            <span className="w-3 text-center shrink-0">:</span>
            <span className="font-normal text-black flex-1">
              {[sekolah.alamat, sekolah.distrikKecamatan, sekolah.kabupaten]
                .filter((v) => v && v.trim() !== '' && v !== '-')
                .join(', ') || '-'}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex">
            <span className="w-32 shrink-0">Kelas</span>
            <span className="w-3 text-center shrink-0">:</span>
            <span className="font-normal text-black flex-1">
              {selectedKelas}
              {sekolah.rombel && sekolah.kelas === selectedKelas ? ` (${sekolah.rombel})` : ''}
            </span>
          </div>
          <div className="flex">
            <span className="w-32 shrink-0">Fase</span>
            <span className="w-3 text-center shrink-0">:</span>
            <span className="font-normal text-black flex-1">{selectedFase}</span>
          </div>
          <div className="flex">
            <span className="w-32 shrink-0">Semester</span>
            <span className="w-3 text-center shrink-0">:</span>
            <span className="font-normal text-black flex-1">
              {!isSem2 ? '1 (Ganjil)' : '2 (Genap)'}
            </span>
          </div>
          <div className="flex">
            <span className="w-32 shrink-0">Tahun Pelajaran</span>
            <span className="w-3 text-center shrink-0">:</span>
            <span className="font-normal text-black flex-1">{sekolah.tahunPelajaran || '-'}</span>
          </div>
        </div>
      </div>

      {/* TABEL NILAI 4 KOLOM RESMI KURIKULUM MERDEKA */}
      <table className="w-full text-[11px] border-collapse border border-black bg-white">
        <thead>
          <tr className="bg-[#f2f2f2] text-black font-bold">
            <th className="border border-black py-1.5 px-2 text-center w-9">No</th>
            <th className="border border-black py-1.5 px-2.5 text-center w-48">Mata Pelajaran</th>
            <th className="border border-black py-1.5 px-2 text-center w-20">Nilai Akhir</th>
            <th className="border border-black py-1.5 px-2.5 text-center">Capaian Kompetensi</th>
          </tr>
        </thead>
        <tbody>
          {studentScores.length === 0 ? (
            <tr>
              <td colSpan={4} className="border border-black py-6 text-center text-slate-500 italic">
                Tidak ada mata pelajaran yang aktif pada filter ini.
              </td>
            </tr>
          ) : (
            <>
              {mainScores.map((item, idx) => renderScorePairRows(item, idx + 1))}

              {mulokScores.length > 0 && (
                <>
                  <tr className="bg-[#f7f7f7]">
                    <td
                      colSpan={4}
                      className="border border-black py-1 px-2.5 text-left font-bold text-black"
                    >
                      Muatan Lokal
                    </td>
                  </tr>
                  {mulokScores.map((item, idx) => renderScorePairRows(item, idx + 1))}
                </>
              )}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

interface ReportExtracurricularTableProps {
  studentEkskul: Extracurricular[];
  minRows?: number;
}

export const ReportExtracurricularTable: React.FC<ReportExtracurricularTableProps> = ({
  studentEkskul,
  minRows = 3
}) => {
  const rowCount = Math.max(minRows, studentEkskul.length);
  const rows = Array.from({ length: rowCount }, (_, i) => studentEkskul[i] || null);

  return (
    <div className="mb-4 text-black">
      <table className="w-full text-[11px] border-collapse border border-black bg-white">
        <thead>
          <tr className="bg-[#f2f2f2] text-black font-bold">
            <th className="border border-black py-1.5 px-2 text-center w-9">No</th>
            <th className="border border-black py-1.5 px-2.5 text-left w-64">
              Kegiatan Ekstrakurikuler
            </th>
            <th className="border border-black py-1.5 px-2.5 text-left">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item, idx) => (
            <tr key={item ? item.id : `empty-ekskul-${idx}`}>
              <td className="border border-black py-1.5 px-2 text-center">{idx + 1}</td>
              <td className="border border-black py-1.5 px-2.5 font-normal">
                {item ? item.jenisEkstrakurikuler : <span className="inline-block h-3.5" />}
              </td>
              <td className="border border-black py-1.5 px-2.5 font-normal">
                {item ? (
                  <span>
                    {item.predikat ? `${item.predikat}${item.keterangan ? ` — ${item.keterangan}` : ''}` : item.keterangan || '-'}
                  </span>
                ) : (
                  <span className="inline-block h-3.5" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
