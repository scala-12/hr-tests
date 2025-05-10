package java_tinkoff;

import java.util.ArrayList;
import java.util.Scanner;
import java.util.logging.ConsoleHandler;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

public class Main {
    private final static String LEFT_S = "(";
    private final static String RIGHT_S = ")";
    private final static char RIGHT_C = ')';
    private final static Logger logger = Logger.getLogger(Main.class.getName());

    public static void main(String[] args) {
        logger.setLevel(Level.FINE);
        ConsoleHandler handler = new ConsoleHandler();
        handler.setLevel(Level.FINE);
        // logger.addHandler(handler);
        logger.setUseParentHandlers(false);

        Scanner scanner = new Scanner(System.in);

        int count = scanner.nextInt() * 2;
        int swap = scanner.nextInt();
        int replace = scanner.nextInt();

        String s = scanner.next();
        scanner.close();

        long left = s.chars().filter(e -> e == '(').count();
        long diff = left - count / 2;

        int payed = 0;
        int balance = 0;

        int swapCost = Math.min(swap, replace * 2);
        ArrayList<Character> list = new ArrayList<>(
                s.chars().mapToObj(e -> Character.valueOf((char) e)).collect(Collectors.toList()));
        int j;
        int startJ;
        for (int i = s.indexOf(RIGHT_S), startI = 0; i != -1; startI = i + 1, i = s.indexOf(RIGHT_S, startI)) {
            balance += i - startI - 1;

            logger.fine(String.format("%d) %dB ", i, balance));
            // break using
            while (balance < 0) {
                if (diff < 0) {
                    diff -= 1;
                    payed += replace;
                    logger.fine("replace");
                    break;
                } else {
                    payed += swapCost;
                    int subBalance = 0;
                    // break using
                    for (j = s.lastIndexOf(LEFT_S), startJ = count - 1; j != -1; startJ = j - 1, j = s.lastIndexOf(
                            LEFT_S,
                            startJ)) {
                        subBalance += startJ - j - 1;
                        if (subBalance < 0) {
                            list.set(j, RIGHT_C);
                            balance += 1;
                            logger.fine(String.format("%d.%d) replace (%d) %dB ", i, j, payed, balance));
                            break;
                        }
                    }
                }
            }
        }
        payed += diff * replace;
        logger.fine(String.format("replace (%dx%d)", replace, diff));

        System.out.println(payed);
    }
}
