import React from "react";
import { Box, Typography, SxProps, Theme } from "@mui/material";
import type { SystemStyleObject } from "@mui/system";
import { toEnglishDigits, toPersianDigits } from "@/utils/digits";

export interface IranLicensePlateProps {
  value?: string;
  vehicleType?: "car" | "motorcycle"; // default car
  sx?: SxProps<Theme>;
}

function parseCarPlate(value: string | undefined) {
  if (!value) return null;
  const src = toEnglishDigits(value);
  const match = src.match(
    /(\d{1,2})\s*([\u0600-\u06FF].*)\s*(\d{3})\s*-?\s*(\d{2})/
  );
  if (!match) return null;
  const [, left2, letter, mid3, code2] = match;
  return { left2, letter, mid3, code2 } as const;
}

function parseMotorcyclePlate(value: string | undefined) {
  if (!value) return null;
  const src = toEnglishDigits(value);
  const digits = (src.match(/\d/g) || []).join("");
  if (digits.length < 5) return null;
  const top = digits.slice(0, Math.min(3, digits.length));
  const bottom = digits.slice(
    top.length,
    Math.min(top.length + 5, digits.length)
  );
  return { top, bottom } as const;
}

const containerBase: SystemStyleObject<Theme> = {
  display: "flex",
  flexDirection: "row /* @noflip */",
  alignItems: "stretch",
  width: "100%",
  maxWidth: 500,
  border: "2px solid",
  borderColor: "#000",
  borderRadius: 0.5,
  overflow: "hidden",
  bgcolor: "#FFF",
  color: "#000",
  containerType: "inline-size",
};

function getCategoryBgColor(
  letter: string | undefined,
  vehicleType: "car" | "motorcycle"
) {
  if (vehicleType === "motorcycle") return ["#FFF", "#000"];
  if (letter === "ت" || letter === "ک" || letter === "ع")
    return ["#F7CB48", "#000"];
  if (letter === "الف") return ["#DA3732", "#FFF"];
  if (letter === "پ" || letter === "ث") return ["#21512D", "#FFF"];
  if (letter === "ز" || letter === "ف") return ["#3477BB", "#FFF"];
  if (letter === "ش") return ["#C7A36A", "#000"];
  return ["#FFF", "#000"];
}

const Flag: React.FC = () => (
  <Box
    sx={{
      width: "7cqw",
      height: "4.25cqw",
      justifyContent: "space-between",
    }}
  >
    <Box sx={{ height: "33.33%", bgcolor: "#239f40" }} />
    <Box sx={{ height: "33.34%", bgcolor: "#FFF" }} />
    <Box sx={{ height: "33.33%", bgcolor: "#da0000" }} />
  </Box>
);

const LeftBlueBand: React.FC<{ basis: string }> = ({ basis }) => (
  <Box
    sx={{
      flex: `0 0 ${basis}`,
      bgcolor: "#1F3B89",
      color: "#FFF",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      py: "0.5cqw",
    }}
  >
    <Flag />
    <Typography
      dir="ltr"
      sx={{
        fontSize: "3cqw",
        fontWeight: 600,
        letterSpacing: -0.5,
        textAlign: "left /* @noflip */",
        lineHeight: 1,
      }}
    >
      I.R.
      <br />
      IRAN
    </Typography>
  </Box>
);

const MidCodeBand: React.FC<{
  code: string;
  basis: string;
  color: string;
}> = ({ code, basis, color }) => (
  <Box
    dir="rtl"
    sx={{
      width: `${basis}`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Typography
      sx={{ fontSize: "16cqw", fontWeight: 900, lineHeight: "auto", color }}
    >
      {toPersianDigits(code)}
    </Typography>
  </Box>
);

const RightCodeBand: React.FC<{
  code: string;
  basis: string;
  color: string;
}> = ({ code, basis, color }) => (
  <Box
    sx={{
      width: "22cqw",
      flex: `0 0 ${basis}`,
      borderLeft: `2px solid ${color} /* @noflip */`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      py: 0.5,
      px: 1,
    }}
  >
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pt: 0.5,
      }}
    >
      <Typography
        sx={{
          fontSize: "7cqw",
          fontWeight: 700,
          lineHeight: 0,
          color,
        }}
      >
        ایران
      </Typography>
    </Box>
    <Typography
      sx={{ fontSize: "14cqw", fontWeight: 900, lineHeight: 1, color }}
    >
      {toPersianDigits(code)}
    </Typography>
  </Box>
);
const IranLicensePlate: React.FC<IranLicensePlateProps> = ({
  value,
  vehicleType = "car",
  sx,
}) => {
  const baseAndCustomArray: SxProps<Theme> = Array.isArray(sx)
    ? [containerBase, ...sx]
    : sx
    ? [containerBase, sx]
    : [containerBase];

  const ratio = vehicleType === "motorcycle" ? 24 / 15 : 52 / 11;

  if (vehicleType === "motorcycle") {
    const parsedMc = parseMotorcyclePlate(value);
    const leftBasis = "16%";
    return (
      <Box
        dir="ltr"
        sx={
          [
            ...(baseAndCustomArray as unknown as any[]),
            { bgcolor: "#FFF", color: "#000", aspectRatio: ratio },
          ] as SxProps<Theme>
        }
      >
        <LeftBlueBand basis={leftBasis} />
        <Box
          sx={{
            flex: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box sx={{ textAlign: "center", width: "100%" }}>
            <Typography
              sx={{
                fontSize: "24cqw",
                fontWeight: 900,
                lineHeight: 1,
                color: "#000",
              }}
            >
              {parsedMc ? toPersianDigits(parsedMc.top) : "---"}
            </Typography>
            <Typography
              sx={{
                fontSize: "24cqw",
                fontWeight: 900,
                lineHeight: 1,
                color: "#000",
              }}
            >
              {parsedMc ? toPersianDigits(parsedMc.bottom) : "-----"}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  const parsed = parseCarPlate(value);
  const [bgColor, color] = getCategoryBgColor(parsed?.letter, "car");

  return (
    <Box
      dir="ltr"
      sx={
        [
          ...(baseAndCustomArray as unknown as any[]),
          {
            bgcolor: bgColor,
            color: color,
            border: "1px solid",
            borderColor: color,
            aspectRatio: ratio,
          },
        ] as SxProps<Theme>
      }
    >
      <LeftBlueBand basis={"8%"} />

      <MidCodeBand
        basis={"70%"}
        code={parsed ? parsed.mid3 + parsed.letter + parsed.left2 : "-- - ---"}
        color={color as string}
      />

      <RightCodeBand
        basis={"22%"}
        code={parsed ? parsed.code2 : "--"}
        color={color as string}
      />
    </Box>
  );
};

export default IranLicensePlate;
