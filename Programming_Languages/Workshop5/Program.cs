using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

class Program
{
    static async Task Main(string[] args)
    {

        Console.OutputEncoding = Encoding.UTF8;
        Console.InputEncoding = Encoding.UTF8;

        var st = new Stopwatch();
        st.Start();

        string[] files = { "text1.txt", "text2.txt", "text3.txt" };

        var tasks = files.Select(async file =>
        {
            try
            {
                await Task.Delay(1000);
                string content = await File.ReadAllTextAsync(file);
                int wordCount = CountWords(content);
                Console.WriteLine($"{file}: {wordCount} слов (поток {Environment.CurrentManagedThreadId})");
                return (file, wordCount);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"{file}: ошибка — {ex.Message}");
                return (file, 0);
            }
        }).ToList();

        // Обрабатываем задачи по мере завершения
        while (tasks.Any())
        {
            var finished = await Task.WhenAny(tasks);
            tasks.Remove(finished);
            await finished; // дожидаемся и выводим результат уже внутри задачи
        }

        st.Stop();
        Console.WriteLine($"\nОбщее время выполнения: {st.Elapsed}");
    }

    static int CountWords(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
            return 0;
        return text.Split([' ', '\r', '\n', '\t'], StringSplitOptions.RemoveEmptyEntries).Length;
    }
}
