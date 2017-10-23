from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from scipy import stats
import logging, sys, json
logging.basicConfig(stream=sys.stderr)
db = SQLAlchemy()


def serialize_list(e):
    d = dict()
    i = 0
    for item in e:
        d[i] = item.serialize
        i = i + 1
    return d


class Data(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    participant_id = db.Column(db.Integer, db.ForeignKey('participant.id'), primary_key=True)
    participant = db.relationship('Participant', foreign_keys=[participant_id], backref="data")
    reaction_time = db.Column(db.Integer)
    
    def __init__(self, id, participant_id, reaction_time):
        self.participant_id = participant_id
        self.reaction_time = reaction_time
    self.id = id
    
    @property
    def serialize(self):
        return {
        "id":self.id,
        "reaction_time":self.reaction_time
    }


class Participant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    gender = db.Column(db.Text)
    age = db.Column(db.Integer)
    monitor = db.Column(db.Text)
    average_time = db.Column(db.Integer)
    
    def __init__(self, gender, age, monitor, average_time):
    self.gender = gender
    self.age = age
    self.monitor = monitor
    self.average_time = average_time
    
    @property
    def serialize(self):
        return {
            "id":self.id,
            "gender":self.gender,
            "age":self.age,
            "monitor":self.monitor,
            "average_time":self.average_time,
            "data":serialize_list(self.data)
    }

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///./experiment.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
app.app_context().push()


@app.route("/")
def hello():
    return app.send_static_file('index.html')


@app.route("/js/app.js")
def appfile():
    return app.send_static_file('js/app.js')


@app.route("/save", methods=['POST'])
def save():
    data = request.json
    results = data.get("results")
    participant = Participant(data.get("gender"), data.get("age"), data.get("monitor"), data.get("averageTime"))
    db.session.add(participant)
    db.session.commit()
    i=0
    for result in results:
    db.session.add(Data(i, participant.id, result))
    i = i + 1
    db.session.commit()
    all_participants = Participant.query.all()
    averages = []
    for participant in all_participants:
    averages.append(participant.average_time)
    percentile = 100-stats.stats.percentileofscore(averages, participant.average_time, kind="mean")
    return jsonify({'percentile':percentile})


@app.route("/getData")
def getData():
    return jsonify(serialize_list(Participant.query.all()))


@app.route("/performTTest")
def perform_ttest():
    orientation_data = []
    contrast_data = []
    all_participants = Participant.query.all()
    for participant in all_participants:
        for x in range(0, 5):
            if participant.data[x].reaction_time != 0 and participant.data[x+5].reaction_time != 0:
                orientation_data.append(participant.data[x].reaction_time)
                contrast_data.append(participant.data[x+5].reaction_time)
    statistic, pvalue = stats.ttest_rel(orientation_data, contrast_data)
    return jsonify({
                   "statistic":statistic,
                   "pvalue":pvalue
                   })


@app.route("/getNormalizedData")
def get_normalized_data():
    orientation_data = []
    contrast_data = []
    all_participants = Participant.query.all()
    for participant in all_participants:
        for x in range(0, 5):
            if participant.data[x].reaction_time != 0 and participant.data[x+5].reaction_time != 0:
                orientation_data.append(participant.data[x].reaction_time)
                contrast_data.append(participant.data[x+5].reaction_time)
    return jsonify({
                   "orientation":json.dumps(orientation_data),
                   "contrast":json.dumps(contrast_data)
                   })


@app.route("/getDataExcel")
def get_excel_data():
    orientation_data = []
    contrast_data = []
    all_participants = Participant.query.all()
    for participant in all_participants:
        for x in range(0, 5):
            orientation_data.append(participant.data[x].reaction_time)
            contrast_data.append(participant.data[x+5].reaction_time)
    return jsonify({
                   "orientation":json.dumps(orientation_data),
                   "contrast":json.dumps(contrast_data)
                   })

if __name__ == "__main__":
    app.run()
