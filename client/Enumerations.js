export default class Enumerations{
    constructor(){
        this.Server = {
            S1 : 'welcome_player',
            S2 : 'players_participating',
            S3 : 'new_position', 
            S4 : 'player_changed_type',
            S5 : 'Powerup_was_eaten',
            S6 : 'New_level', 
            S7 : 'player_changed_values',
            S8 : 'ClassicCoin_was_eaten',
            S9 : 'force'
        }

            
        this.Client = {
            C3 : 'I_have_new_position',
            C4 : 'I_changed_type',
            C5 : 'I_ate_Powerup',
            C7 : 'I_changed_values',
            C8 : 'I_ate_ClassicCoin'
        }
    }
}