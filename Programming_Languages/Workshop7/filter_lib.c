#include <stdlib.h>
#include <string.h>

#ifdef _WIN32
#define EXPORT __declspec(dllexport)
#else
#define EXPORT
#endif

typedef struct Point {
    int x;
    int y;
} Point;

// Тип функции фильтрации: принимает Point и возвращает int (0 или 1)
typedef int (*FilterFunc)(Point);

// Функция filter принимает:
// - массив точек
// - количество точек
// - функцию фильтрации
// - выходной аргумент для отфильтрованного массива (указатель на указатель)
// - выходной аргумент для количества отфильтрованных точек
EXPORT void filter(Point* points, int count, FilterFunc filter_func, Point* out_points, int* out_count) {
    // Сначала считаем, сколько точек пройдет фильтр
    int filtered_count = 0;
    for (int i = 0; i < count; i++) {
        if (filter_func(points[i])) {
            out_points[filtered_count] = points[i];
            filtered_count++;
        }
    }
    
    // Выделяем память для отфильтрованного массива
    //*out_points = (Point*)malloc(sizeof(Point) * filtered_count);
    //if (*out_points == NULL) {
    //    *out_count = 0;
    //    return;
    //}
    
    // Заполняем отфильтрованный массив
    //int index = 0;
    //for (int i = 0; i < count; i++) {
    //    if (filter_func(points[i])) {
    //        (out_points)[index] = points[i];
    //        index++;
    //    }
    //}
    
    *out_count = filtered_count;
}

// Функция для освобождения памяти отфильтрованного массива
EXPORT void free_filtered_points(Point* points) {
    if (points != NULL) {
        free(points);
    }
}

