export function getRandomColor(): string {
  while (true) {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    // Tính độ sáng (0–255)
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

    // Nếu màu tối (brightness < 128) thì dùng
    if (brightness < 128) {
      return (
        "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")
      );
    }
  }
}
