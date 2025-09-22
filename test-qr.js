// Simple test script to verify QR generation
import QRCode from "qrcode";
import fs from "fs";

async function testQRGeneration() {
  try {
    console.log("Testing QR generation...");

    // Test data similar to what the app would generate
    const testData = {
      recipient: "11111111111111111111111111111112", // Example Solana address
      amount: 1000000, // 1 USDC in lamports (6 decimals)
      splToken: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC mint address
      reference: "11111111111111111111111111111111",
      memo: "Test payment",
    };

    // Create a simple Solana Pay URL for testing
    const paymentUrl = `solana:${testData.recipient}?amount=${
      testData.amount
    }&spl-token=${testData.splToken}&reference=${
      testData.reference
    }&memo=${encodeURIComponent(testData.memo)}`;

    console.log("Payment URL:", paymentUrl);

    // Generate QR code
    const qrDataUrl = await QRCode.toDataURL(paymentUrl, {
      width: 256,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    console.log("QR Code generated successfully!");
    console.log("QR Data URL length:", qrDataUrl.length);
    console.log("QR Data URL starts with:", qrDataUrl.substring(0, 50));

    // Save QR code to file for manual testing
    const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, "");
    fs.writeFileSync("test-qr.png", base64Data, "base64");
    console.log("QR code saved to test-qr.png");
  } catch (error) {
    console.error("Error generating QR code:", error);
  }
}

testQRGeneration();
