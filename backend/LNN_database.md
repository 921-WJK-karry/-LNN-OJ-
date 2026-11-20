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
