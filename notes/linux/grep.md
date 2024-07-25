# grep

> 使用`grep -E`或者`egrep`

```bash
egrep PATTERN FILE
egrep -v PATTERN FILE # 反转
egrep -i PATTERN FILE # 无视大小写
egrep -n PATTERN FILE # 显示行号
egrep -c PATTERN FILE # 计数
egrep -A PATTERN FILE # 一并显示往下两行
egrep -B PATTERN FILE # 一并显示往上两行
egrep -C PATTERN FILE # 一并显示往上下两行
egrep -e PATTERN -e PATTERN FILE # 多路匹配
egrep PATTERN FILE FILE # 多文件
egrep -h PATTERN FILE FILE # 多文件(不显示文件名)
egrep -r PATTERN DIR # 遍历文件夹
COMMAND | egrep PATTERN # 从标准输入中读取
```
