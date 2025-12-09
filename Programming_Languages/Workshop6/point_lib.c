#include <math.h>
#include <stdlib.h>

typedef struct Point {
    int x;
    int y;
} Point;

// p[0] и p[1] → первая пара
// p[2] и p[3] → вторая пара
// pairs_count — количество пар, а не точек!
double* process_pairs(Point* p, int pairs_count) {
    double* result = malloc(sizeof(double) * pairs_count);
    if (!result) return NULL;

    for (int i = 0; i < pairs_count; i++) {
        Point a = p[i*2];
        Point b = p[i*2 + 1];

        double dx = (double)a.x - (double)b.x;
        double dy = (double)a.y - (double)b.y;
        result[i] = sqrt(dx*dx + dy*dy);
    }

    return result;
}
