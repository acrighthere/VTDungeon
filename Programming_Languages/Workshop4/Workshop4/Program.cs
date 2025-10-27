// https://raw.githubusercontent.com/sahildit/IMDB-Movies-Extensive-Dataset-Analysis/refs/heads/master/data1/IMDb%20movies.csv

using System.Globalization;
using Microsoft.VisualBasic.FileIO;

List<string[]> ReadAllCsvLines(string filePath)
{
    var result = new List<string[]>();

    using (var parser = new TextFieldParser(filePath))
    {
        parser.TextFieldType = FieldType.Delimited;
        parser.SetDelimiters(",");
        parser.HasFieldsEnclosedInQuotes = true;

        while (!parser.EndOfData)
        {
            string[] fields = parser.ReadFields();
            result.Add(fields);
        }
    }

    return result;
}

string[] ParseMultiValueField(string value)
{
    if (string.IsNullOrWhiteSpace(value) || value.Equals("None", StringComparison.OrdinalIgnoreCase))
        return new string[0];
    
    return value.Split(',').Select(s => s.Trim()).ToArray();
}

// 1. Преобразовать в класс Movie (Select)
var csvLines = ReadAllCsvLines("imdb_movies.csv");
var header = csvLines[0];
var movies = csvLines.Skip(1).Select(line =>
{
    return new Movie
    {
        ImdbTitleId = line[0],
        Title = line[1],
        OriginalTitle = line[2],
        Year = int.TryParse(line[3], out var year) ? year : null,
        DatePublished = line[4],
        Genres = ParseMultiValueField(line[5]),
        Duration = int.TryParse(line[6], out var duration) ? duration : null,
        Countries = ParseMultiValueField(line[7]),
        Languages = ParseMultiValueField(line[8]),
        Directors = ParseMultiValueField(line[9]),
        Writers = ParseMultiValueField(line[10]),
        ProductionCompanies = ParseMultiValueField(line[11]),
        Actors = ParseMultiValueField(line[12]),
        Description = line[13],
        AvgVote = double.TryParse(line[14], NumberStyles.Float, CultureInfo.InvariantCulture, out var avgVote) ? avgVote : null,
        Votes = int.TryParse(line[15], out var votes) ? votes : null,
        Budget = line[16],
        UsaGrossIncome = line[17],
        WorldwideGrossIncome = line[18],
        Metascore = int.TryParse(line[19], out var metascore) ? metascore : null,
        ReviewsFromUsers = int.TryParse(line[20], out var reviewsUsers) ? reviewsUsers : null,
        ReviewsFromCritics = int.TryParse(line[21], out var reviewsCritics) ? reviewsCritics : null
    };
}).ToList();

Console.WriteLine($"Загружено фильмов: {movies.Count}");

// 2. Найти все фильмы режисёра Nolan (Where)
var nolanMovies = movies.Where(m => 
    m.Directors.Any(d => d.Contains("Nolan", StringComparison.OrdinalIgnoreCase))
).ToList();

Console.WriteLine($"\n2. Фильмы режисёра Nolan ({nolanMovies.Count}):");
foreach (var movie in nolanMovies)
{
    Console.WriteLine($"  - {movie.Title} ({movie.Year}) - Рейтинг: {movie.AvgVote}");
}

// 3. 5 самых высокооценённых фильмов выпущенных после 2010
var topRatedAfter2010 = movies
    .Where(m => m.Year > 2010 && m.AvgVote.HasValue)
    .OrderByDescending(m => m.AvgVote)
    .Take(5)
    .ToList();

Console.WriteLine($"\n3. Топ-5 фильмов после 2010 года:");
foreach (var movie in topRatedAfter2010)
{
    Console.WriteLine($"  - {movie.Title} ({movie.Year}) - Рейтинг: {movie.AvgVote}");
}

// 4. Получить список фильмов жанра Drama (количество и средний рейтинг)
var dramaMovies = movies.Where(m => 
    m.Genres.Any(g => g.Equals("Drama", StringComparison.OrdinalIgnoreCase))
).ToList();

var dramaCount = dramaMovies.Count;
var dramaAvgRating = dramaMovies
    .Where(m => m.AvgVote.HasValue)
    .Select(m => m.AvgVote.Value)
    .DefaultIfEmpty(0)
    .Average();

Console.WriteLine($"\n4. Жанр Drama:");
Console.WriteLine($"  Количество фильмов: {dramaCount}");
Console.WriteLine($"  Средний рейтинг: {dramaAvgRating:F2}");

// 5. Режисёр у которого больше всего фильмов
var directorMovieCounts = movies
    .SelectMany(m => m.Directors, (movie, director) => new { Movie = movie, Director = director })
    .Where(x => !string.IsNullOrWhiteSpace(x.Director))
    .GroupBy(x => x.Director, StringComparer.OrdinalIgnoreCase)
    .Select(g => new { Director = g.Key, Count = g.Count() })
    .OrderByDescending(x => x.Count)
    .First();

Console.WriteLine($"\n5. Режисёр с наибольшим количеством фильмов:");
Console.WriteLine($"  {directorMovieCounts.Director} - {directorMovieCounts.Count} фильмов");

class Movie
{
    public string ImdbTitleId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string OriginalTitle { get; set; } = string.Empty;
    public int? Year { get; set; }
    public string DatePublished { get; set; } = string.Empty;
    public string[] Genres { get; set; } = Array.Empty<string>();
    public int? Duration { get; set; }
    public string[] Countries { get; set; } = Array.Empty<string>();
    public string[] Languages { get; set; } = Array.Empty<string>();
    public string[] Directors { get; set; } = Array.Empty<string>();
    public string[] Writers { get; set; } = Array.Empty<string>();
    public string[] ProductionCompanies { get; set; } = [];
    public string[] Actors { get; set; } = Array.Empty<string>();
    public string Description { get; set; } = string.Empty;
    public double? AvgVote { get; set; }
    public int? Votes { get; set; }
    public string Budget { get; set; } = string.Empty;
    public string UsaGrossIncome { get; set; } = string.Empty;
    public string WorldwideGrossIncome { get; set; } = string.Empty;
    public int? Metascore { get; set; }
    public int? ReviewsFromUsers { get; set; }
    public int? ReviewsFromCritics { get; set; }
}