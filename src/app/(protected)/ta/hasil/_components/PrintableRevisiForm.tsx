import { forwardRef } from "react";
import { Box, Typography } from "@mui/material";

interface PrintableRevisiFormProps {
  jadwal: any;
  session: any;
}

export const PrintableRevisiForm = forwardRef<HTMLDivElement, PrintableRevisiFormProps>(
  ({ jadwal, session }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          padding: "40px",
          backgroundColor: "white",
          color: "black",
          fontFamily: "'Times New Roman', Times, serif",
          width: "100%",
        }}
      >
        {/* Centered Title */}
        <Typography
          variant="h6"
          align="center"
          sx={{ fontWeight: "bold", mb: 2, textTransform: "uppercase", fontSize: "16pt" }}
        >
          LAMPIRAN A5
        </Typography>

        {/* Header Table */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid black",
            marginBottom: "20px",
          }}
        >
          <tbody>
            <tr>
              <td
                style={{
                  width: "20%",
                  border: "1px solid black",
                  textAlign: "center",
                  padding: "10px",
                }}
              >
                {/* Fallback PPNS Logo Placeholder */}
                <div style={{ fontWeight: "bold", color: "#1976D2", fontSize: "24px" }}>
                  PPNS
                </div>
              </td>
              <td
                style={{
                  width: "50%",
                  border: "1px solid black",
                  textAlign: "center",
                  fontWeight: "bold",
                  padding: "10px",
                  lineHeight: "1.5",
                  fontSize: "12pt"
                }}
              >
                FORMULIR
                <br />
                REVISI :
                <br />
                PROPOSAL/PROGRESS/TUGAS AKHIR/TUGAS GAMBAR
              </td>
              <td
                style={{
                  width: "30%",
                  border: "1px solid black",
                  padding: "10px",
                  fontSize: "11pt",
                  verticalAlign: "top",
                  lineHeight: "1.5",
                }}
              >
                <div>No. : F.WD I. 016</div>
                <div>Date : 14 Juni 2017</div>
                <div>Rev. : 02</div>
                <div>Page : 1 dari 1</div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Info Detail */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            rowGap: "15px",
            columnGap: "20px",
            mb: 3,
            fontSize: "12pt",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontWeight: "bold", whiteSpace: "nowrap", width: "140px" }}>
              Jurusan/Prodi :
            </span>
            <span style={{ borderBottom: "1px solid black", width: "100%", paddingLeft: "8px" }}>
              {"-"} 
            </span>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Tanggal Ujian :</span>
            <span style={{ borderBottom: "1px solid black", width: "100%", paddingLeft: "8px" }}>
              {new Date(jadwal.tgl_sidang).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontWeight: "bold", whiteSpace: "nowrap", width: "140px" }}>
              Nama Mahasiswa :
            </span>
            <span style={{ borderBottom: "1px solid black", width: "100%", paddingLeft: "8px" }}>
              {session?.user?.name || "-"}
            </span>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>NRP :</span>
            <span style={{ borderBottom: "1px solid black", width: "100%", paddingLeft: "8px" }}>
              {session?.user?.identity_number || "-"}
            </span>
          </Box>
        </Box>

        <Box sx={{ display: "flex", mb: 4, fontSize: "12pt" }}>
          <span style={{ fontWeight: "bold", whiteSpace: "nowrap", width: "140px" }}>Judul :</span>
          <span style={{ borderBottom: "1px solid black", width: "100%", paddingLeft: "8px", lineHeight: "1.5" }}>
            {jadwal.judul_ta}
          </span>
        </Box>

        {/* Evaluasi Table */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid black",
            marginBottom: "30px",
            fontSize: "12pt",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#e2e2e2" }}>
              <th style={{ border: "1px solid black", width: "5%", padding: "8px" }}>No.</th>
              <th style={{ border: "1px solid black", width: "65%", padding: "8px" }}>
                Uraian Revisi Laporan/Peralatan TA
              </th>
              <th style={{ border: "1px solid black", width: "10%", padding: "8px" }}>Hal</th>
              <th style={{ border: "1px solid black", width: "20%", padding: "8px" }}>
                Keterangan
              </th>
            </tr>
          </thead>
          <tbody>
            {(jadwal.penguji && jadwal.penguji.length > 0) ? (
              jadwal.penguji.map((p: any, index: number) => (
                <tr key={index}>
                  <td style={{ border: "1px solid black", textAlign: "center", padding: "8px", verticalAlign: "top" }}>
                    {index + 1}
                  </td>
                  <td style={{ border: "1px solid black", padding: "8px", verticalAlign: "top", whiteSpace: "pre-wrap" }}>
                    {p.catatan ? p.catatan : "-"} 
                    <br/><br/>
                    <small><i>(Oleh: {p.nama_dosen})</i></small>
                  </td>
                  <td style={{ border: "1px solid black", padding: "8px" }}></td>
                  <td style={{ border: "1px solid black", padding: "8px" }}></td>
                </tr>
              ))
            ) : (
                <tr>
                  <td style={{ border: "1px solid black", textAlign: "center", padding: "8px" }}>-</td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>Belum ada penguji/catatan.</td>
                  <td style={{ border: "1px solid black", padding: "8px" }}></td>
                  <td style={{ border: "1px solid black", padding: "8px" }}></td>
                </tr>
            )}
            
            {/* Adding minimum blank rows for padding */}
            <tr>
              <td style={{ border: "1px solid black", padding: "30px 8px" }}></td>
              <td style={{ border: "1px solid black", padding: "30px 8px" }}></td>
              <td style={{ border: "1px solid black", padding: "30px 8px" }}></td>
              <td style={{ border: "1px solid black", padding: "30px 8px" }}></td>
            </tr>
          </tbody>
        </table>

        {/* Tanda Tangan Table */}
        <Typography align="center" sx={{ fontWeight: "bold", fontSize: "11pt", mb: 1 }}>
          TELAH DIREVISI DENGAN PENGARAHAN DOSEN PENGUJI & PEMBIMBING
        </Typography>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid black",
            marginBottom: "20px",
            fontSize: "11pt",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#e2e2e2" }}>
              <th style={{ border: "1px solid black", width: "5%", padding: "6px" }}>NO</th>
              <th style={{ border: "1px solid black", width: "15%", padding: "6px" }}>TANGGAL</th>
              <th style={{ border: "1px solid black", width: "40%", padding: "6px" }}>
                NAMA DOSEN PENGUJI
              </th>
              <th style={{ border: "1px solid black", width: "15%", padding: "6px" }}>
                TANDA TANGAN
              </th>
              <th style={{ border: "1px solid black", width: "25%", padding: "6px" }}>CATATAN</th>
            </tr>
          </thead>
          <tbody>
            {(jadwal.penguji && jadwal.penguji.length > 0) ? (
              jadwal.penguji.map((p: any, idx: number) => (
                <tr key={idx}>
                  <td style={{ border: "1px solid black", textAlign: "center", padding: "6px" }}>{idx + 1}.</td>
                  <td style={{ border: "1px solid black", padding: "15px 6px" }}></td>
                  <td style={{ border: "1px solid black", padding: "6px" }}>{p.nama_dosen}</td>
                  <td style={{ border: "1px solid black", padding: "6px" }}></td>
                  <td style={{ border: "1px solid black", padding: "6px" }}></td>
                </tr>
              ))
            ) : (
                <tr>
                  <td colSpan={5} style={{ border: "1px solid black", padding: "10px", textAlign: "center" }}>Tidak ada penguji</td>
                </tr>
            )}

            <tr style={{ backgroundColor: "#e2e2e2" }}>
              <th style={{ border: "1px solid black", width: "5%", padding: "6px" }}>NO</th>
              <th style={{ border: "1px solid black", width: "15%", padding: "6px" }}>TANGGAL</th>
              <th style={{ border: "1px solid black", width: "40%", padding: "6px" }}>
                NAMA DOSEN PEMBIMBING
              </th>
              <th style={{ border: "1px solid black", width: "15%", padding: "6px" }}>
                TANDA TANGAN
              </th>
              <th style={{ border: "1px solid black", width: "25%", padding: "6px" }}>CATATAN</th>
            </tr>
            <tr>
              <td style={{ border: "1px solid black", textAlign: "center", padding: "6px" }}>1.</td>
              <td style={{ border: "1px solid black", padding: "15px 6px" }}></td>
              <td style={{ border: "1px solid black", padding: "6px" }}></td>
              <td style={{ border: "1px solid black", padding: "6px" }}></td>
              <td style={{ border: "1px solid black", padding: "6px" }}></td>
            </tr>
            <tr>
              <td style={{ border: "1px solid black", textAlign: "center", padding: "6px" }}>2.</td>
              <td style={{ border: "1px solid black", padding: "15px 6px" }}></td>
              <td style={{ border: "1px solid black", padding: "6px" }}></td>
              <td style={{ border: "1px solid black", padding: "6px" }}></td>
              <td style={{ border: "1px solid black", padding: "6px" }}></td>
            </tr>
          </tbody>
        </table>

        {/* Footer notes & Signatures */}
        <Typography sx={{ fontSize: "10pt", mb: 4 }}>
          Note : *) Tanda tangan Penguji dan Pembimbing setelah melaksanakan revisi.
          <br />
          <span style={{ opacity: 0 }}>Note : </span>*) Dosen pembimbing pada ujian proposal adalah dosen pembimbing yang telah ditetapkan oleh Prodi
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%", fontSize: "11pt" }}>
          <Box sx={{ width: "300px", textAlign: "center" }}>
            <Typography>Surabaya, ............................................</Typography>
            <Typography>Ketua Tim,</Typography>
            <Box sx={{ height: "80px" }}></Box>
            <Typography>(........................................................)</Typography>
          </Box>
        </Box>
      </div>
    );
  }
);
