-- Drop existing tables (order: child to parent)
DROP TABLE IF EXISTS dat_ve;
DROP TABLE IF EXISTS suat_chieu;
DROP TABLE IF EXISTS lich_chieu;
DROP TABLE IF EXISTS rap_chieu;
DROP TABLE IF EXISTS dinh_dang_rap;
DROP TABLE IF EXISTS dia_diem;
DROP TABLE IF EXISTS phim;
DROP TABLE IF EXISTS tai_khoan;

-- Dia diem
CREATE TABLE dia_diem (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ten_dia_diem VARCHAR(255) NOT NULL
);

-- Dinh dang rap (IMAX, 2D, 3D, etc.)
CREATE TABLE dinh_dang_rap (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ten_dinh_dang VARCHAR(100) NOT NULL,
    gia_ve INT NOT NULL DEFAULT 70000
);

-- Rap chieu
CREATE TABLE rap_chieu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ten_rap VARCHAR(255) NOT NULL,
    dia_chi VARCHAR(255),
    id_dia_diem INT,
    FOREIGN KEY (id_dia_diem) REFERENCES dia_diem(id)
);

-- Phim
CREATE TABLE phim (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ten_phim VARCHAR(255) NOT NULL,
    anh_phim VARCHAR(255),
    the_loai VARCHAR(255),
    quoc_gia VARCHAR(255),
    mo_ta TEXT,
    ngay_khoi_chieu DATETIME
);

-- Tai khoan
CREATE TABLE tai_khoan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    ho_va_ten VARCHAR(255),
    role TINYINT(1) DEFAULT 1  -- 0: admin, 1: user
);

-- Lich chieu
CREATE TABLE lich_chieu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_phim INT NOT NULL,
    id_rap INT NOT NULL,
    ngay_chieu DATE NOT NULL,
    FOREIGN KEY (id_phim) REFERENCES phim(id),
    FOREIGN KEY (id_rap) REFERENCES rap_chieu(id),
    UNIQUE KEY unique_schedule (id_phim, id_rap, ngay_chieu)
);

-- Suat chieu
CREATE TABLE suat_chieu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_lich_chieu INT NOT NULL,
    gio_chieu TIME NOT NULL,
    id_dinh_dang INT NOT NULL,
    FOREIGN KEY (id_lich_chieu) REFERENCES lich_chieu(id),
    FOREIGN KEY (id_dinh_dang) REFERENCES dinh_dang_rap(id)
);

CREATE TABLE dat_ve (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_suat_chieu INT NOT NULL,
    id_tai_khoan INT NOT NULL,
    so_ghe VARCHAR(255) NOT NULL,
    trang_thai TINYINT(1) DEFAULT 1,  -- 1: đã đặt, 0: hủy
    tien_ve INT NOT NULL DEFAULT 0,   -- Tổng tiền vé ghi nhận lúc đặt
    FOREIGN KEY (id_suat_chieu) REFERENCES suat_chieu(id) ON DELETE CASCADE,
    FOREIGN KEY (id_tai_khoan) REFERENCES tai_khoan(id)
);

-- SEED data

-- Dia Diem
INSERT INTO dia_diem (ten_dia_diem) VALUES ('Hồ Chí Minh'), ('Hà Nội');

-- Dinh dang rap
INSERT INTO dinh_dang_rap (ten_dinh_dang, gia_ve)
VALUES ('2D', 70000), ('3D', 90000), ('IMAX', 120000);

-- Rap chieu
INSERT INTO rap_chieu (ten_rap, dia_chi, id_dia_diem) 
VALUES ('Galaxy Nguyễn Du', '116 Nguyễn Du, Q1', 1),
       ('CGV Vincom Bà Triệu', '191 Bà Triệu, Hà Nội', 2),
       ('Lotte Cinema Gò Vấp', '242 Nguyễn Văn Lượng, Gò Vấp, TP.HCM', 1),
       ('BHD Star Vincom Thảo Điền', 'Vincom Mega Mall, Q2, TP.HCM', 1),
       ('CGV Aeon Mall Long Biên', '27 Cổ Linh, Long Biên, Hà Nội', 2);

-- Phim 
INSERT INTO phim (ten_phim, anh_phim, the_loai, quoc_gia, mo_ta, ngay_khoi_chieu)
VALUES
-- 1
('Avengers: Endgame', 
 'https://upload.wikimedia.org/wikipedia/vi/2/2d/Avengers_Endgame_bia_teaser.jpg', 
 'Hành động', 
 'Mỹ', 
 'Cuộc chiến cuối cùng của các siêu anh hùng.', 
 CURDATE() - INTERVAL 5 DAY),

-- 2
('Inside Out 2', 
 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f7/Inside_Out_2_poster.jpg/250px-Inside_Out_2_poster.jpg', 
 'Tâm lý', 
 'Mỹ', 
 'Hành trình mới của các cảm xúc.', 
 CURDATE() - INTERVAL 3 DAY),

-- 3
('Oppenheimer', 
 'https://upload.wikimedia.org/wikipedia/vi/2/21/Oppenheimer_%E2%80%93_Vietnam_poster.jpg', 
 'Tâm lý', 
 'Mỹ', 
 'Cuộc đời nhà khoa học J. Robert Oppenheimer và dự án Manhattan.', 
 CURDATE() - INTERVAL 1 DAY),

-- 4
('The Marvels', 
 'https://upload.wikimedia.org/wikipedia/en/7/7a/The_Marvels_poster.jpg', 
 'Hành động,Khoa học viễn tưởng', 
 'Mỹ', 
 'Ba nữ siêu anh hùng cùng hợp lực giải cứu vũ trụ.', 
 CURDATE() + INTERVAL 1 DAY),

-- 5
('Barbie', 
 'https://upload.wikimedia.org/wikipedia/en/0/0b/Barbie_2023_poster.jpg', 
 'Hài,Tâm lý', 
 'Mỹ', 
 'Barbie bước ra thế giới thật và khám phá bản thân.', 
 CURDATE() + INTERVAL 2 DAY),

-- 6
('The Creator', 
 'https://upload.wikimedia.org/wikipedia/en/9/94/The_Creator_2023_poster.jpg', 
 'Khoa học viễn tưởng,Hành động', 
 'Anh', 
 'Một thế giới tương lai với trí tuệ nhân tạo thống trị.', 
 CURDATE() + INTERVAL 4 DAY),

-- 7
('Đất Rừng Phương Nam', 
 'https://upload.wikimedia.org/wikipedia/vi/thumb/8/8c/%C4%90%E1%BA%A5t_r%E1%BB%ABng_ph%C6%B0%C6%A1ng_Nam_-_Official_poster.jpg/375px-%C4%90%E1%BA%A5t_r%E1%BB%ABng_ph%C6%B0%C6%A1ng_Nam_-_Official_poster.jpg', 
 'Tâm lý', 
 'Việt Nam', 
 'Hành trình của cậu bé An giữa vùng đất rừng phương Nam.', 
 CURDATE() - INTERVAL 2 DAY),

-- 8
('Spider-Man: Across the Spider-Verse', 
 'https://upload.wikimedia.org/wikipedia/en/b/b4/Spider-Man-_Across_the_Spider-Verse_poster.jpg', 
 'Khoa học viễn tưởng,Hành động', 
 'Mỹ', 
 'Cuộc phiêu lưu đa vũ trụ của Miles Morales.', 
 CURDATE() - INTERVAL 4 DAY),

-- 9
('Thanh Sói: Cúc Dại Trong Đêm', 
 'https://upload.wikimedia.org/wikipedia/vi/thumb/2/29/%C3%81p_ph%C3%ADch_phim_Thanh_S%C3%B3i.jpg/375px-%C3%81p_ph%C3%ADch_phim_Thanh_S%C3%B3i.jpg', 
 'Hành động,Tâm lý', 
 'Việt Nam', 
 'Câu chuyện về tuổi trẻ và bạo lực của Thanh Sói.', 
 CURDATE() + INTERVAL 3 DAY),

-- 10
('John Wick: Chapter 4', 
 'https://upload.wikimedia.org/wikipedia/en/d/d0/John_Wick_-_Chapter_4_promotional_poster.jpg', 
 'Hành động', 
 'Mỹ', 
 'John Wick đối mặt với kẻ thù mới khắp toàn cầu.', 
 CURDATE() + INTERVAL 5 DAY),

-- 11
('Puss in Boots: The Last Wish', 
 'https://upload.wikimedia.org/wikipedia/en/7/78/Puss_in_Boots_The_Last_Wish_poster.jpg', 
 'Hài,Hành động', 
 'Mỹ', 
 'Puss thực hiện hành trình tìm điều ước cuối cùng.', 
 CURDATE() - INTERVAL 1 DAY),

-- 12
('Em và Trịnh', 
 'https://upload.wikimedia.org/wikipedia/vi/b/b3/Poster_gioi_thieu_phim_Em_va_Trinh.jpg', 
 'Tâm lý,Tình cảm', 
 'Việt Nam', 
 'Chuyện tình sâu lắng xoay quanh Trịnh Công Sơn.', 
 CURDATE() - INTERVAL 6 DAY);

-- Tai khoan
INSERT INTO tai_khoan (email, password, ho_va_ten, role)
VALUES 
    ('admin@example.com', '$2b$10$hX5kJ6g0p9X/6WQHHril3ea88UZHk5OdcW8pNMzEF3ko7Nuj.q51K', 'Admin User', 0),
    ('user1@example.com', '$2b$10$hX5kJ6g0p9X/6WQHHril3ea88UZHk5OdcW8pNMzEF3ko7Nuj.q51K', 'Nguyễn Văn A', 1),
    ('user2@example.com', '$2b$10$hX5kJ6g0p9X/6WQHHril3ea88UZHk5OdcW8pNMzEF3ko7Nuj.q51K', 'Trần Thị B', 1);

-- Lich chieu + Suat chieu
-- Lưu ý: mỗi lich_chieu.ngay_chieu = ngay_khoi_chieu tương ứng (không đặt trước ngày khởi chiếu)

-- Avengers (phim ngày khởi chiếu = CURDATE() - 5)
INSERT INTO lich_chieu (id_rap, id_phim, ngay_chieu) VALUES (1, 1, CURDATE() - INTERVAL 5 DAY);
INSERT INTO suat_chieu (id_lich_chieu, gio_chieu, id_dinh_dang) VALUES
(LAST_INSERT_ID(), '18:00:00', 1), (LAST_INSERT_ID(), '20:30:00', 2);

-- Inside Out 2 (ngày khởi chiếu = CURDATE() - 3)
INSERT INTO lich_chieu (id_rap, id_phim, ngay_chieu) VALUES (2, 2, CURDATE() - INTERVAL 3 DAY);
INSERT INTO suat_chieu (id_lich_chieu, gio_chieu, id_dinh_dang) VALUES
(LAST_INSERT_ID(), '17:15:00', 1), (LAST_INSERT_ID(), '19:00:00', 3);

-- Oppenheimer (ngày khởi chiếu = CURDATE() - 1)
INSERT INTO lich_chieu (id_rap, id_phim, ngay_chieu) VALUES (1, 3, CURDATE() - INTERVAL 1 DAY);
INSERT INTO suat_chieu (id_lich_chieu, gio_chieu, id_dinh_dang) VALUES
(LAST_INSERT_ID(), '18:00:00', 1), (LAST_INSERT_ID(), '20:30:00', 3);

-- The Marvels (ngày khởi chiếu = CURDATE() + 1)
INSERT INTO lich_chieu (id_rap, id_phim, ngay_chieu) VALUES (2, 4, CURDATE() + INTERVAL 1 DAY);
INSERT INTO suat_chieu (id_lich_chieu, gio_chieu, id_dinh_dang) VALUES
(LAST_INSERT_ID(), '16:00:00', 2), (LAST_INSERT_ID(), '19:00:00', 1);

-- Barbie (ngày khởi chiếu = CURDATE() + 2)
INSERT INTO lich_chieu (id_rap, id_phim, ngay_chieu) VALUES (3, 5, CURDATE() + INTERVAL 2 DAY);
INSERT INTO suat_chieu (id_lich_chieu, gio_chieu, id_dinh_dang) VALUES
(LAST_INSERT_ID(), '14:30:00', 1), (LAST_INSERT_ID(), '18:30:00', 2);

-- The Creator (ngày khởi chiếu = CURDATE() + 4)
INSERT INTO lich_chieu (id_rap, id_phim, ngay_chieu) VALUES (5, 6, CURDATE() + INTERVAL 4 DAY);
INSERT INTO suat_chieu (id_lich_chieu, gio_chieu, id_dinh_dang) VALUES
(LAST_INSERT_ID(), '17:00:00', 2), (LAST_INSERT_ID(), '20:00:00', 3);

-- Đất Rừng Phương Nam (ngày khởi chiếu = CURDATE() - 2)
INSERT INTO lich_chieu (id_rap, id_phim, ngay_chieu) VALUES (4, 7, CURDATE() - INTERVAL 2 DAY);
INSERT INTO suat_chieu (id_lich_chieu, gio_chieu, id_dinh_dang) VALUES
(LAST_INSERT_ID(), '15:30:00', 1), (LAST_INSERT_ID(), '18:00:00', 2);

-- Spider-Man (ngày khởi chiếu = CURDATE() - 4)
INSERT INTO lich_chieu (id_rap, id_phim, ngay_chieu) VALUES (1, 8, CURDATE() - INTERVAL 4 DAY);
INSERT INTO suat_chieu (id_lich_chieu, gio_chieu, id_dinh_dang) VALUES
(LAST_INSERT_ID(), '16:00:00', 3), (LAST_INSERT_ID(), '19:00:00', 1);

-- Thanh Sói (ngày khởi chiếu = CURDATE() + 3)
INSERT INTO lich_chieu (id_rap, id_phim, ngay_chieu) VALUES (2, 9, CURDATE() + INTERVAL 3 DAY);
INSERT INTO suat_chieu (id_lich_chieu, gio_chieu, id_dinh_dang) VALUES
(LAST_INSERT_ID(), '18:30:00', 2), (LAST_INSERT_ID(), '21:00:00', 3);

-- John Wick 4 (ngày khởi chiếu = CURDATE() + 5)
INSERT INTO lich_chieu (id_rap, id_phim, ngay_chieu) VALUES (3, 10, CURDATE() + INTERVAL 5 DAY);
INSERT INTO suat_chieu (id_lich_chieu, gio_chieu, id_dinh_dang) VALUES
(LAST_INSERT_ID(), '15:00:00', 1), (LAST_INSERT_ID(), '20:00:00', 3);

-- Puss in Boots (ngày khởi chiếu = CURDATE() - 1)
INSERT INTO lich_chieu (id_rap, id_phim, ngay_chieu) VALUES (4, 11, CURDATE() - INTERVAL 1 DAY);
INSERT INTO suat_chieu (id_lich_chieu, gio_chieu, id_dinh_dang) VALUES
(LAST_INSERT_ID(), '14:00:00', 1), (LAST_INSERT_ID(), '17:00:00', 2);

-- Em và Trịnh (ngày khởi chiếu = CURDATE() - 6)
INSERT INTO lich_chieu (id_rap, id_phim, ngay_chieu) VALUES (5, 12, CURDATE() - INTERVAL 6 DAY);
INSERT INTO suat_chieu (id_lich_chieu, gio_chieu, id_dinh_dang) VALUES
(LAST_INSERT_ID(), '16:00:00', 1), (LAST_INSERT_ID(), '19:30:00', 2);
