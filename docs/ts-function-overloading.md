---
id: ts-function-overloading
title: TypeScript中的重载函数
sidebar_label: TypeScript中的重载函数
---

## 什么是函数重载

首先解释一下什么是重载函数：指在同一个类中有多个同名的方法，但是参数不同，调用时根据实参的形式，选择与之匹配的方法执行操作的一种技术。

这些同名方法可能的不同点：

- 参数的类型不同
- 参数的个数不同
- 参数的个数相同但是顺序不同。

举一个 Java 中的例子：

```java
public class Overloading {
    public int test() {
        System.out.println("test1");
        return 1;
    }

    public void test(int a) {
        System.out.println("test2");
    }

    //以下两个参数类型顺序不同
    public String test(int a, String s) {
        System.out.println("test3");
        return "returntest3";
    }

    public String test(String s, int a) {
        System.out.println("test4");
        return "returntest4";
    }

    public static void main(String[] args) {
        Overloading o = new Overloading();
        System.out.println(o.test());
        o.test(1);
        System.out.println(o.test(1, "test3"));
        System.out.println(o.test("test4", 1));
    }
}
```

上面的例子中，`test`方法就是重载函数，它有四个实现，名称相同，但是参数不同。在调用时，会根据实参情况在四个中选择。

## TypeScript 实现函数重载

JavaScript 是动态语言，不支持静态类型，所以无法在语法级别上实现函数重载，只能由开发者写代码来实现。TypeScript 的类型声明是可以实现函数重载的，当然，它只能实现类型提示上的函数重载，不能影响到 JavaScript 实现。

```ts
function sendFile<T>(
  url: string,
  files: File[] | File,
  fileFieldName?: string,
  options?: HttpRequestConfig,
): Promise<T>;
function sendFile<T>(
  url: string,
  files: File[] | File,
  options?: HttpRequestConfig,
): Promise<T>;

function sendFile<T>(
  url: string,
  files: File[] | File,
  fileFieldName?: string | HttpRequestConfig,
  options?: HttpRequestConfig,
): Promise<T> {
  const fileFieldName$ =
    typeof fileFieldName === 'string' ? fileFieldName : 'file';
  const options$ =
    typeof fileFieldName === 'object'
      ? (fileFieldName as HttpRequestConfig)
      : options;

  // TODO
}
```
