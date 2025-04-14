import type { Metadata } from "next";
import { Delius } from "next/font/google";
import "./globals.css";

const delius = Delius({
	weight: "400",
  display: "swap",

});

export const metadata: Metadata = {
	title: "Face CheckIn",
	description: "A Smart Attendance System with Live Facial Recognition",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${delius.className} antialiased`}>
				{children}
			</body>
		</html>
	);
}
