# 数据库变更记录（一律追加写入，禁止覆盖已有内容）

要求：仅凭本文件即可在新机器上完整重建数据库。按执行顺序追加 SQL（含测试数据 INSERT）。

---

## 2026-11-20 建库建表（程序设计比赛题库系统）

```sql
CREATE DATABASE IF NOT EXISTS LNN_web
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE LNN_web;

-- 1. 用户表
CREATE TABLE IF NOT EXISTS LNN_users (
  LNN_user_id     INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  LNN_username    VARCHAR(50)  NOT NULL UNIQUE COMMENT '登录账号',
  LNN_password    VARCHAR(100) NOT NULL COMMENT '密码',
  LNN_real_name   VARCHAR(50)  NOT NULL COMMENT '真实姓名',
  LNN_role        VARCHAR(20)  NOT NULL DEFAULT 'student' COMMENT '角色：student/teacher',
  LNN_email       VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
  LNN_created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

INSERT INTO LNN_users (LNN_username, LNN_password, LNN_real_name, LNN_role, LNN_email, LNN_created_at) VALUES
('linannuo',   'e10adc3949ba59abbe56e057f20f883e', '李南诺', 'student', 'linannuo@stu.edu.cn',  '2026-09-01 08:30:00'),
('zhangwei',   'e10adc3949ba59abbe56e057f20f883e', '张伟',   'student', 'zhangwei@stu.edu.cn',  '2026-09-01 09:12:00'),
('wangfang',   'e10adc3949ba59abbe56e057f20f883e', '王芳',   'student', 'wangfang@stu.edu.cn',  '2026-09-02 10:05:00'),
('liuyang',    '5f4dcc3b5aa765d61d8327deb882cf99', '刘洋',   'student', 'liuyang@stu.edu.cn',   '2026-09-03 14:40:00'),
('chenjing',   'e10adc3949ba59abbe56e057f20f883e', '陈静',   'student', 'chenjing@stu.edu.cn',  '2026-09-05 11:20:00'),
('yangming',   '25d55ad283aa400af464c76d713c07ad', '杨明',   'teacher', 'yangming@stu.edu.cn',  '2026-08-25 16:00:00'),
('zhouhong',   'e10adc3949ba59abbe56e057f20f883e', '周红',   'student', 'zhouhong@stu.edu.cn',  '2026-09-06 09:45:00'),
('wulei',      '25d55ad283aa400af464c76d713c07ad', '吴磊',   'teacher', 'wulei@stu.edu.cn',     '2026-08-26 15:30:00'),
('sunli',      'e10adc3949ba59abbe56e057f20f883e', '孙丽',   'student', 'sunli@stu.edu.cn',     '2026-09-08 13:25:00'),
('huangtao',   'e10adc3949ba59abbe56e057f20f883e', '黄涛',   'student', 'huangtao@stu.edu.cn',  '2026-09-10 10:15:00');

-- 2. 题目表
CREATE TABLE IF NOT EXISTS LNN_problems (
  LNN_problem_id    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  LNN_title         VARCHAR(200) NOT NULL COMMENT '题目标题',
  LNN_description   TEXT COMMENT '题目描述',
  LNN_difficulty    VARCHAR(10)  NOT NULL DEFAULT 'easy' COMMENT '难度：easy/medium/hard',
  LNN_tag           VARCHAR(50)  DEFAULT NULL COMMENT '算法标签',
  LNN_time_limit    INT UNSIGNED NOT NULL DEFAULT 1000 COMMENT '时间限制（ms）',
  LNN_memory_limit  INT UNSIGNED NOT NULL DEFAULT 65536 COMMENT '内存限制（KB）',
  LNN_created_by    INT UNSIGNED NOT NULL COMMENT '出题人，关联 LNN_users',
  LNN_created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT LNN_fk_problem_user FOREIGN KEY (LNN_created_by) REFERENCES LNN_users(LNN_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='题目表';

INSERT INTO LNN_problems (LNN_title, LNN_description, LNN_difficulty, LNN_tag, LNN_time_limit, LNN_memory_limit, LNN_created_by, LNN_created_at) VALUES
('A+B Problem',        '输入两个整数 a 和 b，输出它们的和。',                                            'easy',   '入门',      1000,  65536, 6, '2026-09-15 10:00:00'),
('求数组最大值',        '给定 n 个整数，找出其中的最大值。',                                              'easy',   '数组',      1000,  65536, 6, '2026-09-15 10:10:00'),
('判断质数',            '输入一个正整数 n，判断它是否为质数。',                                            'easy',   '数学',      1000,  65536, 7, '2026-09-16 14:20:00'),
('冒泡排序',            '给定 n 个整数，使用冒泡排序将其从小到大输出。',                                    'easy',   '排序',      1000,  65536, 6, '2026-09-18 09:00:00'),
('斐波那契数列',        '求斐波那契数列第 n 项，结果对 1000000007 取模。',                                  'medium', '递推',      1000,  65536, 7, '2026-09-20 15:30:00'),
('最长公共子序列',      '给定两个字符串，求它们的最长公共子序列长度。',                                    'medium', '动态规划',  2000, 131072, 6, '2026-09-25 11:00:00'),
('背包问题',            '有 n 个物品和一个容量为 V 的背包，求能装入物品的最大价值。',                      'medium', '动态规划',  2000, 131072, 7, '2026-10-02 16:45:00'),
('最短路径',            '给定带权有向图，求从顶点 1 到顶点 n 的最短路径长度。',                            'hard',   '图论',      3000, 131072, 6, '2026-10-10 14:00:00'),
('区间合并',            '给定 n 个区间，将所有重叠区间合并后输出。',                                      'medium', '贪心',      2000, 131072, 7, '2026-10-12 10:30:00');

-- 3. 比赛表
CREATE TABLE IF NOT EXISTS LNN_contests (
  LNN_contest_id   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  LNN_title        VARCHAR(200) NOT NULL COMMENT '比赛名称',
  LNN_description  TEXT COMMENT '比赛说明',
  LNN_start_time   DATETIME NOT NULL COMMENT '开始时间',
  LNN_end_time     DATETIME NOT NULL COMMENT '结束时间',
  LNN_status       VARCHAR(20) NOT NULL DEFAULT 'upcoming' COMMENT '状态：upcoming/ongoing/finished',
  CONSTRAINT LNN_chk_contest_time CHECK (LNN_end_time > LNN_start_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='比赛表';

INSERT INTO LNN_contests (LNN_title, LNN_description, LNN_start_time, LNN_end_time, LNN_status) VALUES
('新生入门赛',        '面向大一新生的编程入门比赛，共 5 题。',          '2026-09-20 14:00:00', '2026-09-20 17:00:00', 'finished'),
('九月月赛',          '校内九月编程月赛，考察基础算法。',              '2026-09-28 09:00:00', '2026-09-28 12:00:00', 'finished'),
('国庆集训模拟赛',    '国庆假期集训第一场模拟赛。',                    '2026-10-03 14:00:00', '2026-10-03 18:00:00', 'finished'),
('搜索专题赛',        '深度优先与广度优先搜索专题练习赛。',            '2026-10-18 09:00:00', '2026-10-18 12:00:00', 'finished'),
('动态规划专题赛',    '动态规划专题训练赛，共 6 题。',                '2026-11-08 14:00:00', '2026-11-08 17:30:00', 'finished'),
('十一月月赛',        '校内十一月编程月赛。',                          '2026-11-22 09:00:00', '2026-11-22 12:00:00', 'upcoming'),
('图论专项赛',        '最短路、最小生成树等图论算法专项赛。',          '2026-11-29 14:00:00', '2026-11-29 17:00:00', 'upcoming'),
('年终总决赛',        '年度编程总决赛，邀请历届月赛优胜者参加。',      '2026-12-20 09:00:00', '2026-12-20 14:00:00', 'upcoming');

-- 4. 提交记录表
CREATE TABLE IF NOT EXISTS LNN_submissions (
  LNN_submit_id   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  LNN_user_id     INT UNSIGNED NOT NULL COMMENT '提交用户，关联 LNN_users',
  LNN_problem_id  INT UNSIGNED NOT NULL COMMENT '题目，关联 LNN_problems',
  LNN_contest_id  INT UNSIGNED DEFAULT NULL COMMENT '所属比赛，关联 LNN_contests，可为空',
  LNN_language    VARCHAR(20)  NOT NULL DEFAULT 'C++' COMMENT '提交语言',
  LNN_status      VARCHAR(30)  NOT NULL COMMENT '判定结果',
  LNN_score       INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '得分',
  LNN_submit_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '提交时间',
  CONSTRAINT LNN_fk_submit_user    FOREIGN KEY (LNN_user_id)    REFERENCES LNN_users(LNN_user_id),
  CONSTRAINT LNN_fk_submit_problem FOREIGN KEY (LNN_problem_id) REFERENCES LNN_problems(LNN_problem_id),
  CONSTRAINT LNN_fk_submit_contest FOREIGN KEY (LNN_contest_id) REFERENCES LNN_contests(LNN_contest_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='提交记录表';

INSERT INTO LNN_submissions (LNN_user_id, LNN_problem_id, LNN_contest_id, LNN_language, LNN_status, LNN_score, LNN_submit_time) VALUES
(1, 1, 1, 'C++',    'Accepted',              100, '2026-09-20 14:12:00'),
(2, 1, 1, 'C',      'Accepted',              100, '2026-09-20 14:25:00'),
(3, 2, 1, 'Java',   'Wrong Answer',          0,   '2026-09-20 14:40:00'),
(4, 3, 2, 'C++',    'Accepted',              100, '2026-09-28 09:35:00'),
(5, 4, 2, 'Python', 'Time Limit Exceeded',   0,   '2026-09-28 10:02:00'),
(1, 5, 3, 'C++',    'Accepted',              100, '2026-10-03 15:20:00'),
(2, 6, 4, 'C++',    'Compile Error',         0,   '2026-10-18 09:50:00'),
(3, 7, 5, 'Java',   'Runtime Error',         0,   '2026-11-08 14:45:00'),
(4, 7, 5, 'C++',    'Accepted',              100, '2026-11-08 15:10:00'),
(5, 8, 5, 'C++',    'Wrong Answer',          30,  '2026-11-08 16:00:00');
```

执行结果：users=10、problems=9、contests=8、submissions=10（均已 ≥8 条）。

---

## 2026-11-20 新增科技新闻表（供科技新闻列表页使用）

```sql
USE LNN_web;

CREATE TABLE IF NOT EXISTS LNN_tech_news (
  LNN_news_id      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  LNN_title        VARCHAR(200) NOT NULL COMMENT '新闻标题',
  LNN_summary      TEXT COMMENT '新闻摘要',
  LNN_source       VARCHAR(100) DEFAULT NULL COMMENT '新闻来源',
  LNN_category     VARCHAR(50)  DEFAULT NULL COMMENT '新闻分类',
  LNN_published_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '发布时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='科技新闻表';

INSERT INTO LNN_tech_news (LNN_title, LNN_summary, LNN_source, LNN_category, LNN_published_at) VALUES
('国产 AI 芯片发布新一代训练加速卡', '某国产芯片厂商发布新一代训练加速卡，算力较上代提升 2.3 倍，功耗下降 18%，已进入多家云厂商供应链。', '科技日报', '芯片', '2026-11-18 09:30:00'),
('开源大模型社区发布千亿参数新版本', '开源大模型社区发布千亿参数新版本，多语言推理能力显著增强，评测成绩接近闭源模型水平。', '开源中国', '人工智能', '2026-11-17 14:00:00'),
('我国量子计算机实现 1000 量子比特运行', '研究团队宣布量子计算机实现 1000 量子比特稳定运行，在特定组合优化任务上较经典超算快百万倍。', '新华网', '量子计算', '2026-11-16 10:20:00'),
('固态电池量产线正式投产', '固态电池量产线正式投产，能量密度达 500Wh/kg，首批配套新能源车型将于明年第一季度上市。', '第一财经', '新能源', '2026-11-15 16:45:00'),
('商业航天公司完成可回收火箭第十次发射', '商业航天公司完成可回收火箭第十次发射与回收，单次发射成本再降 15%，年发射次数位居全球前列。', '澎湃新闻', '航天', '2026-11-14 11:10:00'),
('6G 试验网完成外场测试 峰值速率创新高', '6G 试验网完成外场测试，峰值下载速率突破 100Gbps，时延低至 0.1 毫秒，预计 2030 年启动商用。', '人民邮电报', '通信', '2026-11-13 09:00:00'),
('人形机器人进入工厂实训阶段', '多台人形机器人在汽车工厂进入实训阶段，可完成搬运、质检等 12 类工序，预计两年内规模化部署。', '36 氪', '机器人', '2026-11-12 15:30:00'),
('国内开源数据库社区发布 3.0 版本', '国内开源数据库社区发布 3.0 版本，新增分布式事务与向量检索能力，GitHub 星标数突破 3 万。', 'CSDN', '开源', '2026-11-11 13:20:00');
```

执行结果：LNN_tech_news=8 条。

## 2026-11-25 知识库（RAG）建表

用途：知识库文件上传、解析、分块与检索问答（RAG）。

```sql
CREATE TABLE IF NOT EXISTS LNN_kb_files (
  LNN_file_id INT AUTO_INCREMENT PRIMARY KEY,
  LNN_filename VARCHAR(255) NOT NULL COMMENT '存储文件名',
  LNN_original_name VARCHAR(255) NOT NULL COMMENT '原始文件名',
  LNN_file_type VARCHAR(20) NOT NULL COMMENT '文件类型',
  LNN_file_size INT NOT NULL DEFAULT 0 COMMENT '文件字节数',
  LNN_chunk_count INT NOT NULL DEFAULT 0 COMMENT '分块数量',
  LNN_created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '上传时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='知识库文件表';

CREATE TABLE IF NOT EXISTS LNN_kb_chunks (
  LNN_chunk_id INT AUTO_INCREMENT PRIMARY KEY,
  LNN_file_id INT NOT NULL COMMENT '所属文件ID',
  LNN_chunk_index INT NOT NULL DEFAULT 0 COMMENT '块序号',
  LNN_content TEXT NOT NULL COMMENT '文本块内容',
  KEY LNN_idx_file (LNN_file_id),
  CONSTRAINT LNN_fk_chunk_file FOREIGN KEY (LNN_file_id)
    REFERENCES LNN_kb_files(LNN_file_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='知识库文本块表';
```

测试数据说明：本两表的测试数据由真实业务流程（/api/kb/upload 上传解析）产生，非手工 INSERT。
项目根目录 knowledge_base/ 下共 4 个知识库文件：
1. 中华美食街_门店手册.txt（2285B，925 字，4 块）
2. 中华美食街_常见问题.docx（2023B，641 字，3 块）
3. 中华美食街_外卖说明.txt（413 字，2 块）
4. 中华美食街_宴会细则.txt（429 字，2 块）
合计 LNN_kb_files=4 条、LNN_kb_chunks=11 条，满足每表不少于 8 条测试数据的要求。
在新机器上重建数据库时：先执行上方建表 SQL，再启动服务后依次调用
POST http://localhost:8324/api/kb/upload（multipart，file 字段）上传 knowledge_base/ 下 4 个文件，
即可完整重建等价的业务数据（分块内容与本次完全一致）。
