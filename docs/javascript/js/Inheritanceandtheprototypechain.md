# 继承与原型链

对于使用过基于类的语言（如 Java 或 C++）的开发者们来说，Javascript实在是有些令人困惑，Javascript是动态的，本身不提供`class`的实现。即便是在Es6中引入了`class`关键字，但那也是语法糖，Javascript仍然是基于原型的。



1. `javascript`分为**函数**和**普通对象**，每个对象都有__proto__属性，但是只有函数对象才有prototype属性。
2. Object、Function都是js内置的函数，类似的还有我们常用的Array、RegExp、Date、Boolean、Number、String