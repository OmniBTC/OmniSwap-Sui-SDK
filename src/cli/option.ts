import commander from "commander";
import Chaik from 'chalk';
import figlet from 'figlet';
import clear from 'clear'

let program: commander.Command;

export const initProgram = () => {
    program = new commander.Command();
    clear();
    console.log(Chaik.red(
        figlet.textSync('Sui-AMM-CLI', { horizontalLayout: 'full' })
    ));
    program.requiredOption(
        '-c, --config <path>', 
        'path to your sui config.yml (generated with "sui client active-address")'
    );

    return program;
}