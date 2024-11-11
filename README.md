1.เปิดโปรแกรม MySQL Workbench                                      
2.Create schema                                                 
3.ตั้งชื่อ schema "xo_game" และกำหนด Collation เป็น utf8-utf8_general_ci           
เมื่อสร้างเสร็จ จะแสดงเป็นดังหมายเลข 4                 
5.กด Create a new SQL                            
![image](https://github.com/user-attachments/assets/c6d22a3c-9083-46a8-95c3-7343d9528bca)

6.คำสั่ง sql เพื่อ สร้างตารางตามรูป          
![image](https://github.com/user-attachments/assets/72f577b1-4ea8-4017-bd08-e55088a30566)

7.ได้ตาราง history ตามรูป                          
![image](https://github.com/user-attachments/assets/8759b00b-5032-4f0a-ae52-ec2092c04a86)

8.เปิดโปรแกรม visual studio code ขึ้นมา เลือกโฟล์เดอร์ที่ต้องการ Clone project ลงไป    
![image](https://github.com/user-attachments/assets/45920798-aebf-4c3c-af7f-58e25386900e)

9.Copy link ในหน้า Git hub มา                  
![image](https://github.com/user-attachments/assets/37e2ffc5-5f71-4bc4-8b6e-60ed2f7444dd)

10.ใช้คำสั่ง git clone
![image](https://github.com/user-attachments/assets/323d6aaa-4057-40c6-83b3-b016d07593dd)

11.เมื่อติดตั้งเสร็จให้ cd my-xo-game
![image](https://github.com/user-attachments/assets/249574ff-76a8-4adc-a1be-651c90ba4ec3)

12.เมื่อ cd my-xo-game แล้วหลังจากนั้น ให้ใช้ npm i เพื่อติดตั้ง node_modules

![image](https://github.com/user-attachments/assets/a2cf4d40-16be-4e78-96b7-040ca481d1ee)

13.กด New Terminal อันแรก ให้ใช้คำสั้ง cd my-xo-game enterให้เข้าไปยัง my-xo-game ตามด้วย node server/server.js เพื่อให้ระบบ server เชื่อมต่อกับฐานข้อมูล
![image](https://github.com/user-attachments/assets/d267d6d3-913c-495d-8457-2d218083e339)

14.Terminal อันที่สอง ให้ใช้คำสั่ง npm start เพื่อเปิดเว็บไซต์
![image](https://github.com/user-attachments/assets/f3f73e41-39a0-48aa-a7d5-12585dc2d8be)

15.หน้าวเว็บไซต์     
![image](https://github.com/user-attachments/assets/68141fd6-2eb4-4253-a026-6ac0245f8d97)
![image](https://github.com/user-attachments/assets/908d2e33-455a-4deb-a047-7129e7545769)

------------------------------------ Algorithm ------------------------------------------          
1.หน้า แรก ให้ผู้เล่นเลือก เล่นระหว่าง เล่นทั้ง2คน หรือ เล่นกับบอท                 
2.ถ้าเลือกผู้เล่น 2คน ตัวเกม จะให้เลือกขนาดของตารางได้ โดยเริ่มต้นที่ 3 ช่อง มากสุดได้ 7 ช่อง                              
3.ผู้เล่นคนแรกจะเป็น X อีกคนจะเป็น O โดยช่องจะเป็น button ให้กด                              
4.โหมดผู้เล่น vs ผู้เล่น เมื่อ มีการคลิก button จะตรวจสอบว่า button ที่คลิกว่างหรือไม่ ถ้าเป็นว่าง                        
ให้อัพเดท button สัญลักษณ์ผู้เล่นปัจจุบัน( X หรือ O )                      
หลังจากผู้เล่นลง X หรือ O ในช่อง ฟังก์ชัน calculateWinner จะทำการตรวจสอบว่ามีผู้ชนะหรือยัง                               
ตรวจสอบแถว, คอลัมน์ และเส้นทแยงมุมทั้งหมดในกระดานว่าเป็นสัญลักษณ์เดียวกันหรือไม่ (เช่น X หรือ O)                         
หากพบแถว คอลัมน์ หรือเส้นทแยงมุมที่มีสัญลักษณ์เดียวกันครบ จะถือว่ามีผู้ชนะ และแสดงผลลัพธ์ว่า X หรือ O ชนะเกมนั้น                   
หากกระดานเต็มทุกช่องแล้ว แต่ไม่มีผู้ชนะ ฟังก์ชันจะระบุว่าเกมเสมอ และแสดงข้อความแจ้งเตือนว่าไม่มีผู้ชนะในการเล่นรอบนั้น                    
5. โหมดผู้เล่น vs บอท หากเลือกเล่นในโหมดผู้เล่นกับบอท (1vBot) ตัวบอทจะทำการเคลื่อนไหวตามลำดับของตนเองโดยใช้ฟังก์ชัน botMove               
ฟังก์ชัน botMove จะคำนวณหาตำแหน่งที่ดีที่สุดที่จะลงโดยใช้ อัลกอริธึม Minimax (เป็นอัลกอริธึมที่ใช้วางแผนการเคลื่อนไหวเพื่อหาความน่าจะเป็นที่ดีที่สุดสำหรับบอทในทุกเทิร์น)หากบอทเจอโอกาสที่จะชนะหรือสามารถบล็อกไม่ให้ผู้เล่นชนะในเทิร์นถัดไป บอทจะเลือกลงในช่องนั้นทันที หลังจากบอทเลือกเสร็จ ฟังก์ชัน calculateWinner จะถูกเรียกเพื่อตรวจสอบว่าบอทชนะเกมหรือไม่
6.ทุกครั้งที่จบเกม ระบบจะบันทึกประวัติการเล่นลงในฐานข้อมูล                              
7.เมื่อกด แสดงประวัติการเล่น หน้าจอจะแสดง ประวัติการแข่งขันที่ผ่านมาทั้งหมดโดย ครั้ง ล่าสุด จะอยู่ด้านบนสุด ของผลการแข่งขัน                             
8.ในหน้าเล่นเกม จะมีปุ่ม ให้กด เริ่มใหม่ จะทำการ เคลียร์ปุ่มที่มีการเล่นอยู่ และ มีปุ่มสำหรับกด ออกให้กลับ ไปยังหน้าเลือกเล่นเกม อีกครั้ง                        
