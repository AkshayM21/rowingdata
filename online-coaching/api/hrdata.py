import tcxparser
import os

def hr_TSS(z0bottom, z0top, z1bottom, z1top, z2bottom, z2top, z3bottom, z3top, z4bottom, z4top, file):
    tcx=tcxparser.TCXParser(file)
    zone_data=tcx.hr_percent_in_zones(zones = {"Z0": (-100, 119),"Z1": (120, 199),"Z2": (200, 500)})
    tss_hour = (zone_data["Z0"]*25+zone_data["Z1"]*55+zone_data["Z2"]*70+zone_data["Z3"]*80+zone_data["Z4"]*120)
    return tcx.duration*tss_hour