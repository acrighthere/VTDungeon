using System.Runtime.InteropServices;
using System.Text;
using System.Collections.Generic;
using System.IO;

[DllImport("filter_lib.dll", CallingConvention = CallingConvention.Cdecl)]
static extern void filter([In] Point[] points, [In] int count, FilterFunc filter_func, [Out] Point[] out_points, out int out_count);

[DllImport("filter_lib.dll", CallingConvention = CallingConvention.Cdecl)]
static extern void free_filtered_points(IntPtr points);

Console.OutputEncoding = System.Text.Encoding.UTF8;
Console.WriteLine("Программа запущена!");
System.Console.Out.Flush();

// TODO реализация:
// 1. Читаем файл с точками
try
{
    Console.WriteLine("\n=== Чтение файла с точками ===");
    System.Console.Out.Flush();
    
    // Ищем файл points.txt в текущей директории или в корне проекта
    string pointsFile = "points.txt";
    if (!File.Exists(pointsFile))
    {
        // Пробуем найти в корне проекта (3 уровня выше от bin\Debug\net8.0)
        string projectRoot = Path.GetFullPath(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "..", "..", ".."));
        string pointsInRoot = Path.Combine(projectRoot, "points.txt");
        if (File.Exists(pointsInRoot))
        {
            pointsFile = pointsInRoot;
        }
    }
    
    var points = ReadPointsFromFile(pointsFile);
    Console.WriteLine($"Прочитано точек: {points.Length}");

    // 2. Функции фильтрации для координатных четвертей
    FilterFunc firstQuarter = p => p.x > 0 && p.y > 0 ? 1 : 0;  // I четверть: x > 0, y > 0
    FilterFunc secondQuarter = p => p.x < 0 && p.y > 0 ? 1 : 0; // II четверть: x < 0, y > 0
    FilterFunc thirdQuarter = p => p.x < 0 && p.y < 0 ? 1 : 0;  // III четверть: x < 0, y < 0
    FilterFunc fourthQuarter = p => p.x > 0 && p.y < 0 ? 1 : 0; // IV четверть: x > 0, y < 0

    // 3. Фильтруем точки по четвертям
    Console.WriteLine("\n=== Фильтрация точек по четвертям ===");
    FilterPoints(points, firstQuarter, "I четверть (x > 0, y > 0)");
    FilterPoints(points, secondQuarter, "II четверть (x < 0, y > 0)");
    FilterPoints(points, thirdQuarter, "III четверть (x < 0, y < 0)");
    FilterPoints(points, fourthQuarter, "IV четверть (x > 0, y < 0)");
}
catch (Exception ex)
{
    Console.WriteLine($"Ошибка: {ex.Message}");
    Console.WriteLine($"StackTrace: {ex.StackTrace}");
}

// Функция для чтения точек из файла
Point[] ReadPointsFromFile(string filename)
{
    var pointsList = new List<Point>();
    
    if (!File.Exists(filename))
    {
        Console.WriteLine($"Файл {filename} не найден!");
        return Array.Empty<Point>();
    }
    
    var lines = File.ReadAllLines(filename);
    foreach (var line in lines)
    {
        var parts = line.Trim().Split(new[] { ' ', '\t' }, StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length >= 2 && int.TryParse(parts[0], out int x) && int.TryParse(parts[1], out int y))
        {
            pointsList.Add(new Point { x = x, y = y });
        }
    }
    
    return pointsList.ToArray();
}

// Функция для фильтрации и вывода точек
void FilterPoints(Point[] points, FilterFunc filterFunc, string quarterName)
{
    //IntPtr outPointsPtr;
    int outCount;
    var filteredPoints = new Point[points.Length];
    filter(points, points.Length, filterFunc, filteredPoints, out outCount);
    
    Console.WriteLine($"\n{quarterName}: {outCount} точек");
    
    if (outCount > 0)
    {
        // Копируем данные из неуправляемой памяти в управляемый массив
        
        //var size = Marshal.SizeOf<Point>();
        //for (int i = 0; i < outCount; i++)
        //{
        //    filteredPoints[i] = Marshal.PtrToStructure<Point>(IntPtr.Add(outPointsPtr, i * size));
        //}
        
        // Выводим первые 10 точек (или все, если меньше 10)
        int pointsToShow = Math.Min(10, outCount);
        for (int i = 0; i < pointsToShow; i++)
        {
            Console.WriteLine($"  ({filteredPoints[i].x}, {filteredPoints[i].y})");
        }
        if (outCount > 10)
        {
            Console.WriteLine($"  ... и еще {outCount - 10} точек");
        }
        
        //// Освобождаем память
        //free_filtered_points(outPointsPtr);
    }
}

[StructLayout(LayoutKind.Sequential)]
struct Point
{
    public int x;
    public int y;
}



delegate int MyFunc(int a);

// Делегат для функции фильтрации (Point -> int)
delegate int FilterFunc(Point p);
