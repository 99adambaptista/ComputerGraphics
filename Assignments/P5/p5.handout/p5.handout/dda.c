//-----------------------------------------------------------------------------
// Course: COMP.4270
// Instructor: Krishnan Seetharaman
// DDA Algorithm for lines
// From Foley, van Dam et al., Second Edition in C, Page 75
//-----------------------------------------------------------------------------

#include <stdio.h> 
#include <math.h> 

// to compile
// gcc -o dda dda.c -lm
//

//DD A Function for line generation 
void DDA(int x0, int y0, int x1, int y1) 
{ 
    int x;

    double dy = y1 - y0;
    double dx = x1 - x0;
    double m = dy / dx;
    double y = y0;

    for (x = x0; x <= x1; x++) {
        printf("(%d, %ld)\n", x, (long)round(y));
        y = y + m;
    }
} 

// main program 
int main() 
{ 
    int x0 = 1;
    int y0 = 2;
    int x1 = 20;
    int y1 = 8; 
    
    DDA(x0, y0, x1, y1);
    DDA(x1, y1, x0, y0);
    
    return 0; 
} 

/*
// C program for DDA line generation
#include<stdio.h>
#include<math.h>
//Function for finding absolute value
int abs (int n)
{
    return ( (n>0) ? n : ( n * (-1)));
}
 
//DDA Function for line generation
void DDA(int X0, int Y0, int X1, int Y1)
{
    // calculate dx & dy
    int dx = X1 - X0;
    int dy = Y1 - Y0;
 
    // calculate steps required for generating pixels
    int steps = abs(dx) > abs(dy) ? abs(dx) : abs(dy);
 
    // calculate increment in x & y for each steps
    float Xinc = dx / (float) steps;
    float Yinc = dy / (float) steps;
 
    // Put pixel for each step
    float X = X0;
    float Y = Y0;
    for (int i = 0; i <= steps; i++)
    {
        X += Xinc;           // increment in x at each step
        Y += Yinc;           // increment in y at each step
                             // generation step by step
        printf("(%f, %f)\n", X, Y);
    }
}
 
// Driver program
int main()
{
    // Initialize graphics function  
 
    int X0 = 2, Y0 = 2, X1 = -14, Y1 = -16;
    DDA(2, 2, 14, 16);
    return 0;
}
*/