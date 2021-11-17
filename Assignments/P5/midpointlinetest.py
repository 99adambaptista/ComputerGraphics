def midline(x0, y0, x1, y1):
    dx = x1 - x0;
    dy = y1 - y0;
    d = 2 * dy - dx;
    incrE = 2 * dy;
    incrNE = 2 * (dy - dx);
    x = x0;
    y = y0;

    output = [];

    print("dy = ", dy, "dx = ", dx)
    print("d = ", d)
    print("incrE = ", incrE)
    print("incrNE = ", incrNE)
    print("----------------------------------")

    while (x <= x1):
        print("x = ", x, " y = ", y)
        output += [x,y]


        if (d <= 0):
            print("E")

            d = d + incrE
            x += 1
        else:
            print("NE")           
            d = d + incrNE;
            x += 1
            y += 1
      
    
    print(output);


midline(0, 100, 200, 512)