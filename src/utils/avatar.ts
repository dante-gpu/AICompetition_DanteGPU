export const generateAvatarUrl = (address: string) => {
  // DiceBear API'sini kullanarak rastgele avatar oluştur
  const styles = [
    'pixel-art',
    'adventurer',
    'avataaars',
    'big-ears',
    'bottts',
    'micah'
  ];
  
  // Adrese göre sabit bir stil seç (böylece her seferinde aynı avatar gelir)
  const styleIndex = parseInt(address.slice(0, 4), 16) % styles.length;
  const style = styles[styleIndex];
  
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${address}&backgroundColor=transparent`;
}; 