# 后端接口文档（一律追加写入，禁止覆盖已有内容）

格式：接口路径 | HTTP 方法 | 请求参数（含示例）| 响应格式（含 JSON 示例）| 修改时间

---

GET /api/health | GET | 无参数 | {"code":0,"msg":"服务正常","data":{"port":8324,"time":"2026-11-20T00:00:00.000Z"}} | 2026-11-20

GET /api/problems | GET | 查询参数（均可选）：difficulty=easy/medium/hard，tag=题目标签（如"动态规划"），keyword=标题关键词。示例：/api/problems?difficulty=easy&keyword=A%2BB（不带参数则返回全部） | 成功：{"code":0,"msg":"查询成功","data":{"list":[{"LNN_problem_id":1,"LNN_title":"A+B Problem","LNN_difficulty":"easy","LNN_tag":"入门","LNN_time_limit":1000,"LNN_memory_limit":65536,"LNN_created_at":"2026-09-15T02:00:00.000Z"}],"tags":["入门","动态规划","图论","数学","排序","数组","递推","贪心"]}}；失败：{"code":1,"msg":"查询题目失败","data":null} | 2026-11-20
